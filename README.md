# Simple Blog on Cloudflare Pages

This project builds a static blog from Markdown files in the `posts/` folder.

## How it works

- Write posts as `.md` files inside `posts/`
- Run `node build.mjs`
- The script generates static files into `dist/`
- Cloudflare Pages deploys the `dist/` folder after each GitHub push

## Post format

Each post can include simple front matter at the top:

```md
---
title: My New Post
date: 2026-05-03
description: A short summary for the homepage.
slug: my-new-post
---

# Heading

Your post content goes here.
```

Supported Markdown features in this starter:

- Headings
- Paragraphs
- Bullet lists
- Bold and italic text
- Inline code
- Fenced code blocks
- Links

## Local build

This starter intentionally has no package dependencies.

```bash
node build.mjs
```

If you want to preview the generated site locally, you can serve `dist/` with any static file server.

Example:

```bash
python3 -m http.server 4173 --directory dist
```

## Deploy on GitHub + Cloudflare Pages

1. Create a new GitHub repository and push this project to it.
2. In Cloudflare, go to **Workers & Pages** and create a new **Pages** project from your GitHub repository.
3. Set:
   - **Production branch:** `main`
   - **Build command:** `node build.mjs`
   - **Build output directory:** `dist`
4. Save and deploy.

After that, every time you push a new Markdown file into `posts/`, Cloudflare Pages will rebuild and publish the updated blog automatically.

## Suggested workflow for a new post

1. Create `posts/my-post.md`
2. Add your front matter and content
3. Commit the file
4. Push to GitHub
5. Cloudflare Pages deploys the new post
