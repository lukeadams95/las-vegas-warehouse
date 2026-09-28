#!/bin/sh
# Assemble the published site into dist/.
#
# Cloudflare Pages publishes its build output directory as-is. Publishing
# the repo root exposed internal docs (*.md) as public URLs, so this copies
# everything except repo-only files into dist/, which Pages then serves.
# Pages settings: build command "sh scripts/build-site.sh", build output
# directory "dist". functions/ stays at the repo root, where Pages looks
# for it regardless of the output directory.
set -eu

cd "$(dirname "$0")/.."
rm -rf dist
mkdir dist

tar -cf - \
  --exclude=./dist \
  --exclude=./.git \
  --exclude=./.wrangler \
  --exclude=./.gitignore \
  --exclude=./node_modules \
  --exclude=./functions \
  --exclude=./docs \
  --exclude=./scripts \
  --exclude='*.md' \
  . | tar -xf - -C dist

echo "Built dist/ with $(find dist -type f | wc -l) files"
