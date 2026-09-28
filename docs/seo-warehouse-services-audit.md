# /warehouse-services impressions drop: Phase 1 audit (read-only)

**Date:** 2026-09-28 · **Status:** audit only, nothing changed. Waiting for approval.

**What was audited.**
- **Production** means `main` at `34feb80`. The fixes from the previous round (8 commits on `claude/friendly-newton-t0misf`) are **not merged yet**, so they aren't live.
- The sandbox can't reach `lasvegaswarehouse.com` (the egress proxy returns 403). So both `main` and the branch were served under `wrangler pages dev`, Cloudflare's local Pages runtime, which applies the same `_redirects`, `.html` stripping and 404 handling as production. For every item below, production and the branch behave the same, except where noted.
- **[verify live]** marks what only production or the Cloudflare dashboard can confirm.

---

## Bottom line

1. **The site doesn't mix URL forms.** All 21 pages are flat `name.html` files, served at `/name` with no slash. Every canonical, sitemap URL, internal link, `og:url` and JSON-LD URL uses that same form. Every `/name/` URL 301s to `/name` in one hop. Nothing on the site produces a slash/no-slash duplicate for Google to split impressions across.
2. **The Sep 18→19 step lines up with new content, not with a URL change.** The URL scheme was settled on Sep 16 and hasn't changed since. On **Sep 15, two posts targeting the same head terms went live**:
   - "What Is Warehouse Storage? A Complete Guide"
   - "Warehouse Storage Near Me: Las Vegas Buyer Guide"

   Three to four days is a typical crawl-and-index lag. Fewer impressions with a *better* average position is the signature of a page losing its deep, low-position rankings for broad queries while keeping its strong ones. That's consistent with keyword cannibalization by the new posts, not with a slash split. **This is a hypothesis; GSC can confirm it** (see "How to confirm" below).
3. **Recommendation: keep the no-slash convention. Don't restructure to trailing slashes.** The reasons are in the "Proposed convention" section. If you still want slashes after reading it, I'll do it, but it's a full URL migration, not a file move.

---

## 1. Status check

| Request | Hop chain | Final |
|---|---|---|
| `/warehouse-services` | none | **200** |
| `/warehouse-services/` | `301 Location: /warehouse-services` (the `_redirects` rule for the legacy WP URL) | 200 |
| `/warehouse-services.html` | `308 Location: /warehouse-services` (Pages' native `.html` stripping) | 200 |
| `/warehouse-services/index.html` | none | **404**. No such file has ever existed, and nothing links to it. Harmless. |

Every form reaches the canonical in at most one hop. There are no loops. **[verify live]**

## 2. Root cause in the build output: file structure

This page is **`warehouse-services.html`** (flat), so Pages serves it at `/warehouse-services`.

| Form | Pages |
|---|---|
| **Flat `name.html`, served at `/name`** | **All 21:** antiques-and-auctions, blog, blog-choosing-warehouse-storage, blog-fine-art-storage-tips, blog-las-vegas-fulfillment-hub, blog-types-of-warehouse-storage-facilities, blog-what-is-warehouse-storage, careers, contact, convention-storage, cross-docking, fine-art-installation-removal, get-started, our-history, privacy-policy, safe-secure-art-storage, small-local-moves-and-storage, thank-you, warehouse-services, warehouse-storage-near-me-las-vegas, plus `404.html` |
| **`name/index.html`, served at `/name/`** | **None.** The only `index.html` is the homepage at the root, which is served at `/`. |

There's no generator: the pages are hand-authored HTML. The branch's `scripts/build-site.sh` copies them unchanged.

The **mixed-structure theory doesn't hold.** The `/convention-storage/` and `/cross-docking/` split you saw earlier is the same thing: WordPress-era slash URLs Google still has on file, each now a one-hop 301 to the no-slash page.

## 3. Conflicting rules

- **`_redirects` rules touching trailing slashes.** There are 21 rules of the form `/legacy-slug/` → `/target`: 12 renamed or identical pages, plus 9 old posts. All of them go **slash → no-slash**, the same direction as Pages' built-in behavior. **No conflict, no loop possible.**
- **Rules touching `/warehouse-services`:** see section 7.
- **`_headers`.** None on `main`. The branch adds one that only sets `X-Robots-Tag: noindex` on `*.md` files.
- **Pages Functions.** Only `functions/api/send-lead-notification.js`. It's scoped to `/api/*` and doesn't touch routing.
- **Cloudflare dashboard rules. [verify live]** Page Rules, Redirect Rules, Transform Rules and Bulk Redirects can't be seen from the repo. Two things to check there:
  - Any rule that **adds** a trailing slash (e.g. `/x` → `/x/`) would loop against Pages' `/x/` → `/x`. That would show up as a redirect error, not an impressions drop.
  - Any leftover WordPress-era redirect that duplicates `_redirects`.

## 4. Canonical tags

`warehouse-services.html` has canonical `https://lasvegaswarehouse.com/warehouse-services`, which is served with a **200**. It matches.

- All 20 other pages: canonical equals the URL served with a 200 (checked one by one). **Mismatches: 0.**
- `404.html` has no canonical, which is correct.
- `og:url`, BreadcrumbList `item` values and `@id`s also use the no-slash form.

## 5. Internal links

**Links to `/warehouse-services`, in any form:**

| File:line | Exact value |
|---|---|
| `js/main.js:20` | `href: "warehouse-services.html"`. This is nav data; `siteURL()` renders it as `/warehouse-services` in the header and mobile nav. |
| `js/main.js:168` | `href="/warehouse-services"` (footer) |
| `index.html:277` | `href="/warehouse-services"` |
| `cross-docking.html:333` | `href="/warehouse-services"` |
| `small-local-moves-and-storage.html:166` | `href="/warehouse-services"` |
| `small-local-moves-and-storage.html:129` | JSON-LD breadcrumb `"item": "https://lasvegaswarehouse.com/warehouse-services"` |
| `blog-choosing-warehouse-storage.html:181` | `href="/warehouse-services"` |
| `blog-las-vegas-fulfillment-hub.html:176` | `href="/warehouse-services"` |
| `blog-types-of-warehouse-storage-facilities.html:224` | `href="/warehouse-services"` |
| `blog-types-of-warehouse-storage-facilities.html:230` | `href="/warehouse-services#wine-whiskey-storage"` |
| `blog-what-is-warehouse-storage.html:218` | `href="/warehouse-services"` |
| `warehouse-storage-near-me-las-vegas.html:232` | `href="/warehouse-services"` |
| `thank-you.html:105` | `href="/warehouse-services"` |
| `404.html:83` | `href="/warehouse-services"` |
| `warehouse-services.html:36, 41, 117, 129, 135` | Its own canonical, `og:url` and JSON-LD `@id`/`item`, all `https://lasvegaswarehouse.com/warehouse-services…` |

**Sitewide mismatches:** none. I searched every `href`, `content`, JSON-LD `url`/`@id`/`item`, and the nav data for a slash form, a `.html` form or a legacy slug, and got **0 hits**.

## 6. Sitemap

This URL is listed as `https://lasvegaswarehouse.com/warehouse-services` (no slash). **Sitemap URLs that don't match the form served with a 200: 0 of 20.** All return 200 with no redirect, and none are noindexed.

## 7. Inbound redirects targeting `/warehouse-services`

| Source (`_redirects`) | On `main` → | Proposed | Why |
|---|---|---|---|
| `/warehouse-services/` | `/warehouse-services` | **Keep** | Same page, legacy slash form |
| `/embed/warehouse-services.html` | `/warehouse-services` | **Keep** | Same page |
| `/alcohol-wine-whiskey` (slash, no-slash, feed) | `/warehouse-services` | **Keep** | This page has the "Alcohol Wine & Whiskey" card (`#wine-whiskey-storage`). No dedicated wine page exists. |
| `/proper-professional-alcohol-and-liquor-storage` (slash, no-slash, feed) | `/warehouse-services` | **Keep** | Same reason |
| `/warehouse-pallet-storage-racking` (slash, no-slash, feed) | `/warehouse-services` | **Keep** | This page covers pallets, racking and palletized inventory. It's the closest live page. |
| `/custom-wine-storage` (slash, no-slash, feed) | *(404 on main)* | **Keep** the branch's `/warehouse-services` | Wine and whiskey card |
| `/project/vintage-slot-machines-games/` (+ no-slash, feed) | `/warehouse-services`, via `/project/*` | **`/antiques-and-auctions`**. Already done on the branch, not live. | The gallery shows antique and vintage slot machines |
| `/project/leonardo-davinci/` (+ no-slash, feed) | `/warehouse-services`, via `/project/*` | **`/safe-secure-art-storage`**. Already done on the branch, not live. | Shows the DaVinci exhibit pack/ship work |
| `/project/*` (catch-all: `/project/8217/` and any other project) | `/warehouse-services` | **`/our-history`** (optional) | `/project/` URLs were portfolio work samples. `/our-history` carries the "Specialty work, done right." portfolio (car crating, art collections, slot machines, statues, DaVinci, KISS). The homepage has the same section, but sending a catch-all to `/` would be a homepage dump. |
| `/{page}/feed` for `/warehouse-services` itself | `/blog` on `main`; `/warehouse-services` on the branch | **Keep** the branch version | Parent page |

**If you know the other WordPress `/project/` slugs** (e.g. KISS collection, car crating, statues), send them from GSC. Each can get an explicit rule to its matching page, ahead of the catch-all.

## 8. The page itself (report only, no edits)

| Field | Value | "Las Vegas"? |
|---|---|---|
| `<title>` | Warehouse Storage Services \| Las Vegas Warehouse | Only in the brand suffix |
| Meta description | Storage and warehouse services in the heart of Las Vegas. Receiving, cross-docking, order fulfillment, and short- or long-term storage. | Yes |
| H1 | Warehouse Storage Services | **No** |
| First paragraph | "Storage and warehouse services in the heart of Las Vegas at your convenience. …" | Yes |

**Overlap with the Sep 15 posts** (content finding only):

| Page | Title | H1 |
|---|---|---|
| `/blog-what-is-warehouse-storage` | What Is Warehouse Storage? A Complete Guide | What Is Warehouse Storage? |
| `/warehouse-storage-near-me-las-vegas` | Warehouse Storage Near Me: Las Vegas Buyer Guide | How to Find the Right Warehouse Storage Near You **in Las Vegas** |
| `/warehouse-services` | Warehouse Storage Services \| Las Vegas Warehouse | Warehouse Storage Services |

The "near me" post is the only one of the three whose H1 names Las Vegas. That makes it the stronger match for the local queries the services page used to catch at deep positions.

---

## How to confirm the cause in GSC (5 minutes)

1. **Performance → Pages.** Compare the last 7 days with the previous 7 and filter the page list to URLs containing `warehouse`.
   - If `/warehouse-services/` (slash) **gained** about what `/warehouse-services` lost, it's a slash split.
   - If `/blog-what-is-warehouse-storage` or `/warehouse-storage-near-me-las-vegas` gained it, it's cannibalization.
2. **Performance → click `/warehouse-services` → Queries, same comparison.** See which queries disappeared, then click one and open the Pages tab to see which URL now gets it.
3. **URL Inspection → `https://lasvegaswarehouse.com/warehouse-services/`.** Check "Google-selected canonical". It should be the no-slash URL. If Google chose the slash URL itself despite the 301, tell me: that would change the recommendation.

---

## Proposed sitewide trailing-slash convention

**Keep the no-slash convention: `/name`.** I'm arguing against the brief's slash target because:

1. **There's nothing to fix structurally.** The site is 100% consistent, and Google is already consolidating the WP-era slash URLs through single-hop 301s. Flipping the convention resets that consolidation for every URL at once.
2. **It's a second full URL migration within weeks of the first.**
   - The canonical URL of all 20 indexable pages would change, including 6 blog posts that have never existed at a slash URL.
   - All 113 redirect targets, the sitemap, 21 canonicals, `og:url`s and JSON-LD `@id`s, `siteURL()` in `js/main.js`, and `404.html` would all have to change.
   - The 21 legacy `/x/` → `/x` rules would have to be deleted (they'd loop against `/x/index.html`) and replaced by Pages' native `/x` → `/x/` 308.
3. **It would break every page's styling and images unless every asset path is rewritten first.** The pages use **201 document-relative references** (`css/style.css`, `js/main.js`, `images/…`). Under `/warehouse-services/`, those resolve to `/warehouse-services/css/style.css` and 404. The same class of bug created the `/embed/*.html` 404s.
4. **It wouldn't address the likely cause** (cannibalization since Sep 15), and it would muddy the before/after data needed to diagnose it.
5. **The upside is small.** Slash URLs would save one 301 hop for WP-era backlinks, but a single 301 already passes those signals. The homepage being `index.html` isn't evidence either way: `/` is the same URL in both conventions.

**If you still choose slashes,** the change would be:
1. Move each `name.html` to `name/index.html`, and rewrite all 201 relative asset paths plus `css/style.css`'s `../images/` reference to root-relative.
2. Delete the 21 slash → no-slash rules, and repoint every rule target to `/name/`.
3. Flip canonicals, `og:url`, JSON-LD, `siteURL()`, `404.html` and the sitemap.
4. Verify every page in both forms (`/name` → 308 → `/name/`, one hop, 200).

It would be one atomic commit, verified in the emulator before merging.

---

## Proposed changes (numbered; nothing done)

1. **Keep the no-slash convention.** No restructure.
2. **Merge `claude/friendly-newton-t0misf` to `main`** (the 8 previously approved commits, not yet live). This moves the two `/project/` URLs off `/warehouse-services` and fixes the other items from the last round. Then complete dashboard step D1 (build settings) from `CHANGELOG-seo-fixes.md`.
3. **Optional:** repoint the `/project/*` catch-all from `/warehouse-services` → `/our-history`, the portfolio page.
4. **Cloudflare dashboard [verify live]:** confirm there are no Page Rules, Redirect Rules or Transform Rules touching trailing slashes or `/warehouse-services`, then purge the cache after the merge.
5. **Run the three GSC checks above** and send me the results. If they confirm cannibalization, the fix is content, and that's your decision (I won't edit titles or copy under the ground rules). Options:
   - Differentiate the posts from the services page. The posts target informational "what is / how to choose" intent; the services page targets the transactional "warehouse storage services Las Vegas" intent.
   - Consider adding "Las Vegas" to the services page's H1 and title.
   - Make sure each post links to `/warehouse-services` with descriptive anchor text (all four warehouse-storage posts already link to it once).
