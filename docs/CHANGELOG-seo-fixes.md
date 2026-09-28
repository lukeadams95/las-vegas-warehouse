# SEO fixes: changelog

**Site:** lasvegaswarehouse.com, a static site on Cloudflare Pages (not WordPress).
**Branch:** `claude/friendly-newton-t0misf`. **Dates:** 2026-09-28.
**Audit:** [`seo-phase1-audit.md`](seo-phase1-audit.md). **Full redirect list:** [`redirect-map.csv`](redirect-map.csv).

Every change is a git commit. There's no database or `.htaccess`, so git history is the backup.

**To roll back a change:** `git revert <commit>`, then push to `main`. Cloudflare Pages redeploys automatically. Dashboard changes are rolled back in the dashboard.

## Changes in the repo

| # | Change | Where | Commit | Rollback |
|---|---|---|---|---|
| 1 | Phase 1 audit report added | `docs/seo-phase1-audit.md` (originally at the repo root) | `a8c417e` | `git revert a8c417e` |
| 2 | `/embed/` and `/embed/*` no longer redirect to the homepage; they now return 404. The 7 per-page `/embed/*.html` rules and `/embed/index.html` → `/` are kept. | `_redirects` | `c3f8926` | `git revert c3f8926` |
| 3 | `X-Robots-Tag: noindex` on every `*.md` URL | `_headers` (new file) | `f5f1384` | `git revert f5f1384` |
| 4 | Docs moved to `docs/`. Build script `scripts/build-site.sh` publishes the site to `dist/` without docs, scripts, `functions/` or `*.md`. `.gitignore` added for `dist/` and `.wrangler/`. **Inactive until the dashboard change in step D1 below.** | `docs/`, `scripts/build-site.sh`, `.gitignore` | `ee77850` | Undo D1 first, then `git revert ee77850` |
| 5 | New redirects, all 301 and single hop (details below the table) | `_redirects` | `8689bf0` | `git revert 8689bf0` |
| 6 | Removed `Disallow: /cdn-cgi/l/email-protection` | `robots.txt` | `5c74d9f` | `git revert 5c74d9f` |
| 7 | `<lastmod>` added to all 20 sitemap URLs, using each page file's last commit date | `sitemap.xml` | `14fa20d` | `git revert 14fa20d` |
| 8 | This changelog and `redirect-map.csv` | `docs/` | (this commit) | `git revert` this commit |
| 9 | `/warehouse-services` impressions-drop audit (read-only, no site change; awaiting approval) | `docs/seo-warehouse-services-audit.md` | (see git log) | `git revert` that commit |

**Redirects added in change 5:**

| Old URL | New target | Notes |
|---|---|---|
| `/contact-us` | `/contact` | No-slash form |
| `/custom-wine-storage` | `/warehouse-services` | Slash, no-slash, and `/feed/` |
| `/art-courier-transportation-examples` | `/fine-art-installation-removal` | Slash, no-slash, and `/feed/` |
| `/project/vintage-slot-machines-games` | `/antiques-and-auctions` | Previously went to `/warehouse-services` |
| `/project/leonardo-davinci` | `/safe-secure-art-storage` | Previously went to `/warehouse-services` |
| `/{page}/feed` and `/{page}/feed/` for 19 live pages | `/{page}` | Previously the catch-all sent these to `/blog` |
| `/sitemap_index.xml`, `/wp-sitemap.xml`, `/page-sitemap.xml`, `/post-sitemap.xml` | `/sitemap.xml` | Legacy WordPress sitemap URLs |

**What was not changed, and why:**

- **Trailing slash.** No change. The canonical URLs have no trailing slash. Cloudflare Pages natively strips slashes, so forcing them on would create a redirect loop.
- **Holiday page** (`/last-minute-holiday-shipping-las-vegas-nv/`). **Pending.** No backup exists, and the Wayback Machine is blocked from this environment. It still 301s to `/cross-docking`, and the holiday URLs will be retargeted once the page is rebuilt.
- **Homepage services content.** Report only; this is content work awaiting a decision.
- **`/wp-content/uploads/*`.** Stays 404. The media no longer exists, so 404 is the correct answer.

## Cloudflare dashboard steps (someone with dashboard access must do these)

| # | Step | Where | Rollback |
|---|---|---|---|
| D1 | After merging to `main`, set **Build command** = `sh scripts/build-site.sh` and **Build output directory** = `dist`, leaving Root directory empty. Save, then retry the latest deployment. | Workers & Pages → project → Settings → Build → Build configuration | Clear the build command and set the output directory back to the previous value (repo root) |
| D2 | *(Recommended)* Turn off **Email Address Obfuscation**. The site's `mailto:` links are intentionally public. | Security → Settings, or Scrape Shield (depending on dashboard version) | Turn it back on |
| D3 | Review **Redirect Rules, Page Rules and Bulk Redirects** for WordPress-era rules that duplicate or conflict with `_redirects`. None should add a trailing slash. | Rules | — |
| D4 | **Purge cache** (Purge Everything) after the deploy | Caching → Configuration | — |

## Verification (Phase 3)

**Method.** Cloudflare's local Pages runtime (`wrangler pages dev`) served the repo, with `_redirects`, `_headers`, native `.html` stripping and `404.html` all applied. I traced redirects hop by hop with `curl`. This sandbox can't reach the live domain, so **re-run these checks against production after the deploy.** For example:

```sh
for u in $(cut -d'|' -f1 urls.txt); do curl -sIL -o /dev/null -w "$u %{http_code} %{num_redirects} %{url_effective}\n" "https://lasvegaswarehouse.com$u"; done
```

**Results:**

- **129 URLs checked:** every URL in the brief plus every static source in the redirect map.
  - 123 end on a 200. None take more than 1 hop.
  - 6 end on a 404, all intentionally: `/embed/` leftovers and `/wp-content/uploads/*`.
- **All 113 `_redirects` rules** reach a 200 in one hop. No chains, no loops, no duplicate sources, and no rule targets the homepage except `/index.html`, `/index` and `/embed/index.html`.
- **Sitemap:** all 20 URLs return 200 in 0 hops. None have a trailing slash or a noindex tag.
- **Feeds:** no page outputs RSS or Atom `<link>` tags. `/feed/` → `/blog` returns 200.
- **Built `dist/` output** (checked before the redirect additions): same behavior for every URL, except that `*.md`, `scripts/` and function source files return 404. The lead-form function still runs.

Hops are counted by the manual trace. A 308 comes from Cloudflare Pages itself (`.html` stripping or trailing-slash removal); a 301 comes from `_redirects`.

| URL | Status | Hops | Final URL |
|---|---|---|---|
| `/convention-storage` | 200 | 0 | `/convention-storage` |
| `/convention-storage/` | 200 | 1 (301) | `/convention-storage` |
| `/cross-docking` | 200 | 0 | `/cross-docking` |
| `/cross-docking/` | 200 | 1 (301) | `/cross-docking` |
| `/custom-wine-storage` | 200 | 1 (301) | `/warehouse-services` |
| `/custom-wine-storage/` | 200 | 1 (301) | `/warehouse-services` |
| `/contact-us` | 200 | 1 (301) | `/contact` |
| `/contact-us/` | 200 | 1 (301) | `/contact` |
| `/alcohol-wine-whiskey/` | 200 | 1 (301) | `/warehouse-services` |
| `/art-courier-transportation-examples/` | 200 | 1 (301) | `/fine-art-installation-removal` |
| `/art-courier-transportation-examples` | 200 | 1 (301) | `/fine-art-installation-removal` |
| `/last-minute-holiday-shipping-las-vegas-nv/` | 200 | 1 (301) | `/cross-docking` |
| `/2025-holiday-christmas-shipping-deadlines/` | 200 | 1 (301) | `/cross-docking` |
| `/category/warehouse-storage/` | 200 | 1 (301) | `/blog` |
| `/project/8217/` | 200 | 1 (301) | `/warehouse-services` |
| `/project/8217/feed/` | 200 | 1 (301) | `/warehouse-services` |
| `/antiques-and-auctions.html` | 200 | 1 (308) | `/antiques-and-auctions` |
| `/safe-secure-art-storage.html` | 200 | 1 (308) | `/safe-secure-art-storage` |
| `/cross-docking.html` | 200 | 1 (308) | `/cross-docking` |
| `/unlocking-efficiency-convention-and-trade-show-storage/` | 200 | 1 (301) | `/convention-storage` |
| `/project/vintage-slot-machines-games/` | 200 | 1 (301) | `/antiques-and-auctions` |
| `/project/leonardo-davinci/` | 200 | 1 (301) | `/safe-secure-art-storage` |
| `/proper-professional-alcohol-and-liquor-storage/` | 200 | 1 (301) | `/warehouse-services` |
| `/feed/` | 200 | 1 (301) | `/blog` |
| `/feed` | 200 | 1 (301) | `/blog` |
| `/comments/feed/` | 200 | 1 (301) | `/blog` |
| `/cross-docking/feed/` | 200 | 1 (301) | `/cross-docking` |
| `/advanced-crate-fabrication/feed/` | 200 | 1 (301) | `/safe-secure-art-storage` |
| `/project/leonardo-davinci/feed/` | 200 | 1 (301) | `/safe-secure-art-storage` |
| `/embed/` | 404 | 0 | `/embed/` |
| `/embed/safe-secure-art-storage.html` | 200 | 1 (301) | `/safe-secure-art-storage` |
| `/embed/contact.html` | 200 | 1 (301) | `/contact` |
| `/embed/warehouse-services.html` | 200 | 1 (301) | `/warehouse-services` |
| `/embed/get-started.html` | 200 | 1 (301) | `/get-started` |
| `/embed/small-local-moves-and-storage.html` | 200 | 1 (301) | `/small-local-moves-and-storage` |
| `/wp-content/uploads/*` | 404 | 0 | `/wp-content/uploads/*` |
| `/wp-content/uploads/2023/05/photo.jpg` | 404 | 0 | `/wp-content/uploads/2023/05/photo.jpg` |
| `/author/drwebinsteingmail-com/page/2/` | 200 | 1 (301) | `/blog` |
| `/author/drwebinsteingmail-com/` | 200 | 1 (301) | `/blog` |
| `/blog` | 200 | 0 | `/blog` |
| `/blog/` | 200 | 1 (308) | `/blog` |
| `/blog.html` | 200 | 1 (308) | `/blog` |
| `/index.html` | 200 | 1 (301) | `/` |
| `/robots.txt` | 200 | 0 | `/robots.txt` |
| `/sitemap.xml` | 200 | 0 | `/sitemap.xml` |
| `/sitemap_index.xml` | 200 | 1 (301) | `/sitemap.xml` |
| `/wp-sitemap.xml` | 200 | 1 (301) | `/sitemap.xml` |
| `/page-sitemap.xml` | 200 | 1 (301) | `/sitemap.xml` |
| `/thank-you` | 200 | 0 | `/thank-you` |
| `/warehouse-services/` | 200 | 1 (301) | `/warehouse-services` |
| `/fine-art-installation-and-removal/` | 200 | 1 (301) | `/fine-art-installation-removal` |
| `/antiques-auctions/` | 200 | 1 (301) | `/antiques-and-auctions` |
| `/embed/foo.html` | 404 | 0 | `/embed/foo.html` |
| `/embed/some-post/` | 404 | 0 | `/embed/some-post/` |
| `/2025/embed/` | 404 | 0 | `/2025/embed/` |
| `/custom-wine-storage/feed/` | 200 | 1 (301) | `/warehouse-services` |
| `/art-courier-transportation-examples/feed/` | 200 | 1 (301) | `/fine-art-installation-removal` |
| `/project/vintage-slot-machines-games` | 200 | 1 (301) | `/antiques-and-auctions` |
| `/project/vintage-slot-machines-games/feed/` | 200 | 1 (301) | `/antiques-and-auctions` |
| `/project/leonardo-davinci` | 200 | 1 (301) | `/safe-secure-art-storage` |
| `/warehouse-services/feed/` | 200 | 1 (301) | `/warehouse-services` |
| `/blog/feed/` | 200 | 1 (301) | `/blog` |
| `/post-sitemap.xml` | 200 | 1 (301) | `/sitemap.xml` |
| `/index` | 200 | 1 (301) | `/` |
| `/safe-secure-art-storage/` | 200 | 1 (301) | `/safe-secure-art-storage` |
| `/get-started/` | 200 | 1 (301) | `/get-started` |
| `/careers/` | 200 | 1 (301) | `/careers` |
| `/small-local-moves-and-storage/` | 200 | 1 (301) | `/small-local-moves-and-storage` |
| `/our-history/` | 200 | 1 (301) | `/our-history` |
| `/privacy-policy/` | 200 | 1 (301) | `/privacy-policy` |
| `/alcohol-wine-whiskey` | 200 | 1 (301) | `/warehouse-services` |
| `/proper-professional-alcohol-and-liquor-storage` | 200 | 1 (301) | `/warehouse-services` |
| `/warehouse-pallet-storage-racking/` | 200 | 1 (301) | `/warehouse-services` |
| `/warehouse-pallet-storage-racking` | 200 | 1 (301) | `/warehouse-services` |
| `/last-minute-holiday-shipping-las-vegas-nv` | 200 | 1 (301) | `/cross-docking` |
| `/2025-holiday-christmas-shipping-deadlines` | 200 | 1 (301) | `/cross-docking` |
| `/choosing-the-right-crate-design-materials/` | 200 | 1 (301) | `/blog-fine-art-storage-tips` |
| `/choosing-the-right-crate-design-materials` | 200 | 1 (301) | `/blog-fine-art-storage-tips` |
| `/renting-a-professional-warehouse-what-to-know/` | 200 | 1 (301) | `/warehouse-storage-near-me-las-vegas` |
| `/renting-a-professional-warehouse-what-to-know` | 200 | 1 (301) | `/warehouse-storage-near-me-las-vegas` |
| `/advanced-crate-fabrication/` | 200 | 1 (301) | `/safe-secure-art-storage` |
| `/advanced-crate-fabrication` | 200 | 1 (301) | `/safe-secure-art-storage` |
| `/unlocking-efficiency-convention-and-trade-show-storage` | 200 | 1 (301) | `/convention-storage` |
| `/alcohol-wine-whiskey/feed/` | 200 | 1 (301) | `/warehouse-services` |
| `/proper-professional-alcohol-and-liquor-storage/feed/` | 200 | 1 (301) | `/warehouse-services` |
| `/warehouse-pallet-storage-racking/feed/` | 200 | 1 (301) | `/warehouse-services` |
| `/last-minute-holiday-shipping-las-vegas-nv/feed/` | 200 | 1 (301) | `/cross-docking` |
| `/2025-holiday-christmas-shipping-deadlines/feed/` | 200 | 1 (301) | `/cross-docking` |
| `/choosing-the-right-crate-design-materials/feed/` | 200 | 1 (301) | `/blog-fine-art-storage-tips` |
| `/unlocking-efficiency-convention-and-trade-show-storage/feed/` | 200 | 1 (301) | `/convention-storage` |
| `/renting-a-professional-warehouse-what-to-know/feed/` | 200 | 1 (301) | `/warehouse-storage-near-me-las-vegas` |
| `/warehouse-services/feed` | 200 | 1 (301) | `/warehouse-services` |
| `/safe-secure-art-storage/feed/` | 200 | 1 (301) | `/safe-secure-art-storage` |
| `/safe-secure-art-storage/feed` | 200 | 1 (301) | `/safe-secure-art-storage` |
| `/fine-art-installation-removal/feed/` | 200 | 1 (301) | `/fine-art-installation-removal` |
| `/fine-art-installation-removal/feed` | 200 | 1 (301) | `/fine-art-installation-removal` |
| `/antiques-and-auctions/feed/` | 200 | 1 (301) | `/antiques-and-auctions` |
| `/antiques-and-auctions/feed` | 200 | 1 (301) | `/antiques-and-auctions` |
| `/convention-storage/feed/` | 200 | 1 (301) | `/convention-storage` |
| `/convention-storage/feed` | 200 | 1 (301) | `/convention-storage` |
| `/cross-docking/feed` | 200 | 1 (301) | `/cross-docking` |
| `/small-local-moves-and-storage/feed/` | 200 | 1 (301) | `/small-local-moves-and-storage` |
| `/small-local-moves-and-storage/feed` | 200 | 1 (301) | `/small-local-moves-and-storage` |
| `/get-started/feed/` | 200 | 1 (301) | `/get-started` |
| `/get-started/feed` | 200 | 1 (301) | `/get-started` |
| `/blog/feed` | 200 | 1 (301) | `/blog` |
| `/blog-types-of-warehouse-storage-facilities/feed/` | 200 | 1 (301) | `/blog-types-of-warehouse-storage-facilities` |
| `/blog-types-of-warehouse-storage-facilities/feed` | 200 | 1 (301) | `/blog-types-of-warehouse-storage-facilities` |
| `/blog-what-is-warehouse-storage/feed/` | 200 | 1 (301) | `/blog-what-is-warehouse-storage` |
| `/blog-what-is-warehouse-storage/feed` | 200 | 1 (301) | `/blog-what-is-warehouse-storage` |
| `/warehouse-storage-near-me-las-vegas/feed/` | 200 | 1 (301) | `/warehouse-storage-near-me-las-vegas` |
| `/warehouse-storage-near-me-las-vegas/feed` | 200 | 1 (301) | `/warehouse-storage-near-me-las-vegas` |
| `/blog-choosing-warehouse-storage/feed/` | 200 | 1 (301) | `/blog-choosing-warehouse-storage` |
| `/blog-choosing-warehouse-storage/feed` | 200 | 1 (301) | `/blog-choosing-warehouse-storage` |
| `/blog-fine-art-storage-tips/feed/` | 200 | 1 (301) | `/blog-fine-art-storage-tips` |
| `/blog-fine-art-storage-tips/feed` | 200 | 1 (301) | `/blog-fine-art-storage-tips` |
| `/blog-las-vegas-fulfillment-hub/feed/` | 200 | 1 (301) | `/blog-las-vegas-fulfillment-hub` |
| `/blog-las-vegas-fulfillment-hub/feed` | 200 | 1 (301) | `/blog-las-vegas-fulfillment-hub` |
| `/our-history/feed/` | 200 | 1 (301) | `/our-history` |
| `/our-history/feed` | 200 | 1 (301) | `/our-history` |
| `/careers/feed/` | 200 | 1 (301) | `/careers` |
| `/careers/feed` | 200 | 1 (301) | `/careers` |
| `/contact/feed/` | 200 | 1 (301) | `/contact` |
| `/contact/feed` | 200 | 1 (301) | `/contact` |
| `/privacy-policy/feed/` | 200 | 1 (301) | `/privacy-policy` |
| `/privacy-policy/feed` | 200 | 1 (301) | `/privacy-policy` |
| `/embed/index.html` | 200 | 1 (301) | `/` |
| `/embed/convention-storage.html` | 200 | 1 (301) | `/convention-storage` |
| `/embed/cross-docking.html` | 200 | 1 (301) | `/cross-docking` |

## Google Search Console follow-up (after the deploy and cache purge)

**Request indexing (URL Inspection → Request indexing).** These are the pages that picked up redirected legacy URLs, plus the pages the brief says lost impressions:

- `https://lasvegaswarehouse.com/`
- `https://lasvegaswarehouse.com/warehouse-services`
- `https://lasvegaswarehouse.com/fine-art-installation-removal`
- `https://lasvegaswarehouse.com/antiques-and-auctions`
- `https://lasvegaswarehouse.com/safe-secure-art-storage`
- `https://lasvegaswarehouse.com/contact`
- `https://lasvegaswarehouse.com/convention-storage`
- `https://lasvegaswarehouse.com/cross-docking`
- `https://lasvegaswarehouse.com/blog`

**Sitemaps.**
1. Resubmit `https://lasvegaswarehouse.com/sitemap.xml`.
2. Remove any listed WordPress sitemap (`sitemap_index.xml`, `wp-sitemap.xml`, `page-sitemap.xml`, `post-sitemap.xml`). They now redirect, but they shouldn't stay submitted.

**Reports:**

| Report | Action |
|---|---|
| **Not found (404)** | **Validate fix.** The expected leftovers are `/embed/*` URLs with no page match and `/wp-content/uploads/*`. Both are intentional 404s, so validation will partly "fail" on them. That's fine. |
| **Page with redirect** | **Don't validate.** It's informational: these are the legacy URLs now redirecting as intended, and it drains on its own. |
| **Excluded by 'noindex' tag** (old feeds and author archives) | **Validate fix.** They now 301 to live pages. |
| **Blocked by robots.txt** (`/cdn-cgi/l/email-protection`) | No action. It will move back to "Not found". Turn off Email Obfuscation (step D2) to stop the URL being generated at all. |
