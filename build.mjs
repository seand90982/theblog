import { mkdir, readFile, readdir, rm, stat, writeFile, copyFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const postsDir = path.join(rootDir, "posts");
const staticDir = path.join(rootDir, "static");
const distDir = path.join(rootDir, "dist");
const blogDir = path.join(distDir, "blog");

async function main() {
  await cleanDist();
  await mkdir(blogDir, { recursive: true });

  const posts = await loadPosts();
  await Promise.all([
    writeFile(path.join(distDir, "index.html"), renderIndexPage(posts), "utf8"),
    writeFile(path.join(distDir, "404.html"), render404Page(), "utf8"),
    copyStaticAssets(),
  ]);

  await Promise.all(
    posts.map((post) =>
      writeFile(path.join(blogDir, `${post.slug}.html`), renderPostPage(post), "utf8"),
    ),
  );

  console.log(`Built ${posts.length} post${posts.length === 1 ? "" : "s"} into ${distDir}`);
}

async function cleanDist() {
  await rm(distDir, { recursive: true, force: true });
  await mkdir(distDir, { recursive: true });
}

async function loadPosts() {
  const entries = await readdir(postsDir, { withFileTypes: true }).catch((error) => {
    if (error.code === "ENOENT") {
      throw new Error(`Missing posts directory at ${postsDir}`);
    }

    throw error;
  });

  const markdownFiles = entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".md"))
    .map((entry) => entry.name)
    .sort();

  const posts = await Promise.all(
    markdownFiles.map(async (fileName) => {
      const absolutePath = path.join(postsDir, fileName);
      const fileContents = await readFile(absolutePath, "utf8");
      const { frontMatter, body } = parseFrontMatter(fileContents);
      const fileStats = await stat(absolutePath);
      const slug = slugify(frontMatter.slug || fileName.replace(/\.md$/i, ""));
      const title = frontMatter.title || humanizeSlug(slug);
      const date = frontMatter.date || fileStats.mtime.toISOString().slice(0, 10);
      const excerpt = frontMatter.description || extractExcerpt(body);

      return {
        slug,
        title,
        date,
        excerpt,
        content: renderMarkdown(body),
      };
    }),
  );

  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function parseFrontMatter(source) {
  if (!source.startsWith("---\n")) {
    return { frontMatter: {}, body: source.trim() };
  }

  const closingIndex = source.indexOf("\n---\n", 4);

  if (closingIndex === -1) {
    return { frontMatter: {}, body: source.trim() };
  }

  const rawFrontMatter = source.slice(4, closingIndex).trim();
  const body = source.slice(closingIndex + 5).trim();
  const frontMatter = {};

  for (const line of rawFrontMatter.split("\n")) {
    const separatorIndex = line.indexOf(":");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");

    if (key) {
      frontMatter[key] = value;
    }
  }

  return { frontMatter, body };
}

function renderMarkdown(source) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let paragraph = [];
  let listItems = [];
  let codeFence = null;

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      html.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      html.push(`<ul>${listItems.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ul>`);
      listItems = [];
    }
  };

  for (const line of lines) {
    if (line.startsWith("```")) {
      flushParagraph();
      flushList();

      if (codeFence) {
        html.push(
          `<pre><code class="language-${escapeHtml(codeFence.language)}">${escapeHtml(codeFence.lines.join("\n"))}</code></pre>`,
        );
        codeFence = null;
      } else {
        codeFence = {
          language: line.slice(3).trim(),
          lines: [],
        };
      }

      continue;
    }

    if (codeFence) {
      codeFence.lines.push(line);
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      const level = headingMatch[1].length;
      html.push(`<h${level}>${renderInline(headingMatch[2].trim())}</h${level}>`);
      continue;
    }

    const listMatch = line.match(/^[-*]\s+(.*)$/);
    if (listMatch) {
      flushParagraph();
      listItems.push(listMatch[1].trim());
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();

  if (codeFence) {
    html.push(
      `<pre><code class="language-${escapeHtml(codeFence.language)}">${escapeHtml(codeFence.lines.join("\n"))}</code></pre>`,
    );
  }

  return html.join("\n");
}

function renderInline(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function extractExcerpt(source) {
  const plainText = source
    .replace(/^---[\s\S]*?---\n?/, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*`-]/g, " ")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

  return plainText.slice(0, 150).trim() + (plainText.length > 150 ? "..." : "");
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function humanizeSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(value) {
  const parsed = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsed);
}

function renderIndexPage(posts) {
  const postsMarkup =
    posts.length === 0
      ? `<p>No posts yet. Add a Markdown file to <code>posts/</code> and rebuild.</p>`
      : `
      <ul>
        ${posts.map((post) => `<li><a href="./blog/${post.slug}.html">${escapeHtml(post.title)}</a></li>`).join("\n")}
      </ul>`;

  return renderDocument({
    pageTitle: "Archive",
    bodyClass: "home",
    assetPrefix: ".",
    homeHref: "./index.html",
    content: `
      <h1 id="archive">Archive</h1>
      ${postsMarkup}
    `,
    footer: `<p><a href="./index.html">&larr; Home</a></p>`,
  });
}

function renderPostPage(post) {
  return renderDocument({
    pageTitle: `${post.title} | Archive`,
    bodyClass: "post-page",
    assetPrefix: "..",
    homeHref: "../index.html",
    content: `
      <article class="post">
        <p class="post-meta">${formatDate(post.date)}</p>
        <h1>${escapeHtml(post.title)}</h1>
        <div class="post-body">
          ${post.content}
        </div>
      </article>
    `,
    footer: `<p><a href="../index.html">&larr; Home</a></p>`,
  });
}

function render404Page() {
  return renderDocument({
    pageTitle: "Page Not Found",
    bodyClass: "not-found",
    assetPrefix: ".",
    homeHref: "./index.html",
    content: `
      <section class="archive-header">
        <h1>404</h1>
        <p>That page is not here. Try heading back to the archive.</p>
        <p><a href="./index.html">Back home</a></p>
      </section>
    `,
    footer: `<p><a href="./index.html">&larr; Home</a></p>`,
  });
}

function renderDocument({ pageTitle, bodyClass, assetPrefix, homeHref, content, footer = "" }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(pageTitle)}</title>
    <meta name="description" content="A static blog generated from Markdown files.">
    <link rel="stylesheet" href="${assetPrefix}/styles.css">
  </head>
  <body class="${bodyClass}">
    <div class="page-shell">
      <a href="${homeHref}" class="site-title">Simple Blog</a>
      <main>
        ${content}
      </main>
      <footer class="post-footer">
        ${footer}
      </footer>
    </div>
  </body>
</html>`;
}

async function copyStaticAssets() {
  await copyDirectory(staticDir, distDir);
}

async function copyDirectory(sourceDir, targetDir) {
  const entries = await readdir(sourceDir, { withFileTypes: true });
  await mkdir(targetDir, { recursive: true });

  await Promise.all(
    entries.map(async (entry) => {
      const sourcePath = path.join(sourceDir, entry.name);
      const targetPath = path.join(targetDir, entry.name);

      if (entry.isDirectory()) {
        await copyDirectory(sourcePath, targetPath);
        return;
      }

      if (entry.isFile()) {
        await copyFile(sourcePath, targetPath);
      }
    }),
  );
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
