#!/bin/zsh

set -euo pipefail

repo_root="$(cd "$(dirname "$0")" && pwd)"
cd "$repo_root"

branch="$(git branch --show-current)"

if [[ -z "$branch" ]]; then
  echo "Not on a git branch."
  exit 1
fi

message="${1:-Publish posts $(date +%Y-%m-%d\ %H:%M:%S)}"

git add -A posts

if git diff --cached --quiet; then
  echo "No staged post changes to publish."
  exit 0
fi

git commit -m "$message"
git push -u origin "$branch"

echo "Published post changes to $branch."
