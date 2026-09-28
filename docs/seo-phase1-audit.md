# SEO Phase 1 Audit (read-only): lasvegaswarehouse.com

**Date:** 2026-09-28 · **Status:** Phase 1 complete. No site behavior was changed. Waiting for approval before Phase 2.

---

## 0. Read this first: the brief's platform assumptions are wrong

The brief assumes a live WordPress install (WP-CLI, `wp db export`, `.htaccess`, a Yoast or Rank Math plugin, post revisions, trash). **This site no longer runs on WordPress.** The repository is a hand-built static site deployed on **Cloudflare Pages**:

| Brief assumes | What's actually there |
|---|---|
| WordPress + WP-CLI | Static `.html` files, no CMS, no database |
| Redirect plugin / `.htaccess` | **`_redirects`** (Cloudflare Pages) is the only place redirects are defined. No `.htaccess`, `functions.php`, or plugin exists. |
| SEO plugin (Yoast / Rank Math) | None. Canonicals, robots meta, and JSON-LD are hand-written in each page's `<head>`. |
| WP sitemap index + child sitemaps | One hand-written `sitemap.xml` (20 URLs) |
| Trailing-slash canonical (`/page/`) | **No-slash canonical (`/page`)**. Every canonical, sitemap URL, and internal link uses the extensionless, no-slash form. |
| Trash / drafts / revisions to restore | No WP database here. The old posts only survive on the old WP host or its backups, if those still exist. |
| Server-side functions | One Pages Function: `functions/api/send-lead-notification.js` (lead form email) |

The site's git history starts on 2026-08-17. The WordPress site was replaced by this rebuild, and most of the reported GSC problems are leftovers from that migration.

**How this was audited.** The sandbox can't reach `lasvegaswarehouse.com`: every request returns `403` from the environment's egress proxy, not from the site. So nothing below was fetched from production. Instead I ran the repo under **`wrangler pages dev`**, Cloudflare's local Pages runtime, which applies the same `_redirects`, `.html`-stripping, and `404.html` logic as production. Then I traced every URL with a manual hop-by-hop `curl` loop. Things only production or the Cloudflare dashboard can confirm are marked **[verify live]**.

---

## A. Trailing-slash duplicates

| URL | Status | Hops → final |
|---|---|---|
| `/convention-storage` | 200 | 0 (canonical) |
| `/convention-storage/` | 301 → `/convention-storage` → 200 | 1 |
| `/cross-docking` | 200 | 0 (canonical) |
| `/cross-docking/` | 301 → `/cross-docking` → 200 | 1 |
| `/custom-wine-storage` | **404** | 0 (no page, no rule) |
| `/custom-wine-storage/` | **404** | 0 (no page, no rule) |
| `/contact-us` | **404** | 0 (**gap:** only the slash form has a rule) |
| `/contact-us/` | 301 → `/contact` → 200 | 1 |

- **Permalink structure.** Not applicable (no WP). The site's URL convention is extensionless with no trailing slash. Cloudflare Pages enforces this natively: `/x.html` → 308 → `/x`, and `/x/` → 308 → `/x` for any page not already covered by a `_redirects` rule.
- **Canonicals.** All 21 pages declare the **no-slash** URL, for example `https://lasvegaswarehouse.com/cross-docking`. The homepage declares `/`. They are consistent with the sitemap and internal links. **No page canonicalizes to a trailing-slash URL.**
- **Internal links missing the trailing slash.** Not a defect here, because no-slash is the canonical form. The inverse check (internal links that hit a redirect: `.html`, trailing slash, or absolute legacy URLs) found **0**. Nav and footer links come from `siteURL()` in `js/main.js`, which emits `/page`. Page bodies use root-relative `/page`.
- **`.htaccess` / Cloudflare conflicts.** There's no `.htaccess`. `_redirects` has no rule that adds a slash, so no loops are possible. **[verify live]** In the Cloudflare dashboard, check **Rules → Redirect Rules, Page Rules, Bulk Redirects** for any leftover WP-era rule that adds or strips slashes. A slash-adding rule there would loop against Pages' native slash stripping.
- **Why GSC shows "duplicates splitting impressions."** Google still holds the WP-era `/page/` URLs alongside the new `/page` URLs. Both slash forms already consolidate in one 301/308 hop, so this resolves as Google recrawls. Nothing on the site is producing new slash duplicates.

> ⚠️ **Phase 2 item 1 ("enforce trailing slash sitewide") should NOT be done as written.** Cloudflare Pages always 308s `/x/` → `/x` for a file named `x.html`. A rule sending `/x` → `/x/` would create an **infinite redirect loop on every page**. Flipping to slash URLs would mean moving every page to `x/index.html` and rewriting all 21 canonicals, the sitemap, internal links, JSON-LD, and all 60 redirect targets. That's a second URL migration six weeks after the first, and it would reset the consolidation Google is doing now. **Recommendation: keep the no-slash canonical.** It's already enforced correctly.

---

## B. Real 404 pages

There's no trash, draft, or revision store to search. I checked the repo's git history instead; none of these pages ever existed in the static site.

| Old URL | Current behavior | Finding | Proposed target |
|---|---|---|---|
| `/alcohol-wine-whiskey/` | 301 → `/warehouse-services` (200) | Already redirected. The suggested `/custom-wine-storage/` **doesn't exist** on the site. `/warehouse-services` has a dedicated "Alcohol Wine & Whiskey" card (`#wine-whiskey-storage`). | **Keep** `/warehouse-services` |
| `/art-courier-transportation-examples/` | **404** (both slash forms) | No rule. `/fine-art-installation-removal` covers on-site art moving, transport, and "courier"-style work with a project gallery. | **Add** → `/fine-art-installation-removal` |
| `/last-minute-holiday-shipping-las-vegas-nv/` | 301 → `/cross-docking` | Can't be restored from here because the content isn't in the repo. `/2025-holiday-christmas-shipping-deadlines/` is **also not live** (it too 301s to `/cross-docking`), so the fallback in the brief isn't available. `/cross-docking` is only loosely related. `/blog-las-vegas-fulfillment-hub` (shipping speed and transit times) is closer. | **Your call:** (a) if the old WP host or a backup still exists, send me the post and I'll rebuild it as a 2026 page before the season; or (b) retarget both holiday URLs → `/blog-las-vegas-fulfillment-hub` |
| `/category/warehouse-storage/` | 301 → `/blog` (via `/category/*`) | The category no longer exists (no WP). The blog index is the closest listing page. | **Keep** `/blog` |
| `/project/8217/`, `/project/8217/feed/` | 301 → `/warehouse-services` (via `/project/*`) | `8217` is the numeric part of `&#8217;` (a curly apostrophe) that WP leaked into a project slug. Without the WP database I can't tell which project it was, so the slug can't be "fixed". The catch-all already gives it one hop to a 200. | **Keep**, unless you know which project it was. Then point it at the matching page. |

---

## C. Existing redirects audit

| URL | Hops | Final URL | Final | Topically relevant? |
|---|---|---|---|---|
| `/antiques-and-auctions.html` | 1 (308, Pages native) | `/antiques-and-auctions` | 200 | ✅ same page |
| `/safe-secure-art-storage.html` | 1 (308) | `/safe-secure-art-storage` | 200 | ✅ same page |
| `/cross-docking.html` | 1 (308) | `/cross-docking` | 200 | ✅ same page |
| `/unlocking-efficiency-convention-and-trade-show-storage/` | 1 (301) | `/convention-storage` | 200 | ✅ |
| `/project/vintage-slot-machines-games/` | 1 (301) | `/warehouse-services` | 200 | ⚠️ weak. `/antiques-and-auctions` has vintage and antique slot machines in its gallery. |
| `/project/leonardo-davinci/` | 1 (301) | `/warehouse-services` | 200 | ⚠️ weak. `/safe-secure-art-storage` shows the DaVinci exhibit pack/ship work. |
| `/proper-professional-alcohol-and-liquor-storage/` | 1 (301) | `/warehouse-services` | 200 | ✅ (wine and whiskey card) |

**Full redirect list.** `_redirects` has 60 rules. I traced every rule's source through the emulator:

- **Chains:** 0. Every rule reaches its final page in exactly 1 hop.
- **Loops:** 0.
- **Redirects to a 404:** 0. Every target returns 200.
- **Redirects to the homepage:** 2, and both are flagged:
  - `/embed/` → `/`
  - `/embed/*` → `/` (catch-all)

  `/index.html` and `/index` → `/` are fine; they're the same page.
- **Weak catch-alls (not errors, but improvable):**
  - `/project/*` → `/warehouse-services`
  - `/:slug/feed/` → `/blog`: a feed of a *live* page (for example `/cross-docking/feed/`) lands on `/blog` instead of its own page

---

## D. Feed URLs

- **Why feeds "404".** The static site generates no RSS. But `_redirects` already sends:
  - `/feed/` and `/comments/feed/` → `/blog`
  - every known legacy post feed → that post's topical page
  - `/:slug/feed/` → `/blog`
  - `/project/*/feed/` → `/warehouse-services`

  All of these are 1 hop to a 200 in the emulator. The feed rules were deployed on 2026-09-16 and 2026-09-17. **Any GSC 404 for these URLs crawled before that date is stale.** Check "Last crawled" in the URL Inspection tool. If a crawl *after* 2026-09-17 still shows 404, `_redirects` isn't being applied in production. **[verify live]**
- **`<link rel="alternate" type="application/rss+xml">` tags.** None. No page outputs a feed link, so Phase 2 item 5's `wp_head` change isn't needed.

---

## E. Junk / low-priority 404s

| URL | Cause | Current behavior |
|---|---|---|
| `/embed/safe-secure-art-storage.html`, `/embed/contact.html`, `/embed/warehouse-services.html`, `/embed/get-started.html`, `/embed/small-local-moves-and-storage.html` | Not WP URLs. They were created by a since-fixed bug: `404.html` and `js/main.js` used relative links, so a 404 served at `/embed/` linked to `/embed/contact.html` and so on. Fixed on 2026-09-16 (commit `7a05191`); links are now root-relative. | 301 → the matching real page, 1 hop |
| `/embed/` | Legacy WP oEmbed endpoint | 301 → `/` (homepage dump, flagged) |
| `/wp-content/uploads/*` (literal `*`) | No link on any page, script, or `robots.txt` produces it. The only occurrence of this literal string in the deployed files is the text of **`/seo-audit.md`**, which is in the site root and so is **publicly served**. Google extracts URL-like strings from plain-text files. **Most likely source: `seo-audit.md`.** **[verify live]** Confirm with URL Inspection → "Referring page". | 404 (correct response) |
| `/cdn-cgi/l/email-protection` | Cloudflare Email Obfuscation (Scrape Shield). Expected. | ⚠️ `robots.txt` currently **does** `Disallow: /cdn-cgi/l/email-protection` (added 2026-09-16). This contradicts your "do NOT block in robots.txt" instruction. See change #9. |
| `/author/drwebinsteingmail-com/page/2/` | See below | 301 → `/blog` (via `/author/*`) |

**Author slug exposing an email.** WordPress builds `user_nicename` (the author slug) from `user_login` by stripping characters. A WP account whose *username was an email address* ended up with the slug `drwebinsteingmail-com`. That was presumably the old web developer's account, and it made their Gmail address publicly guessable. On the static site there are **no user accounts and no author pages**: the only surviving trace is Google's memory of the URL, and it now 301s to `/blog`. No rename is possible or needed here. **Action item for you:** if the old WordPress install is still running anywhere (old host, staging), delete or rename that account there, and change that account's password wherever it was reused.

---

## F. Sitemap

- **`/sitemap.xml`:** a single `urlset` (no index, no children) with 20 URLs. **All 20 return 200 in 0 hops.** None have a trailing slash, which is correct for this site, and none are noindexed. `/thank-you` (noindex) is correctly excluded.
- **`robots.txt`:** `Sitemap: https://lasvegaswarehouse.com/sitemap.xml`. ✅ Correct.
- **Old WP sitemaps:** `/sitemap_index.xml`, `/wp-sitemap.xml`, and `/page-sitemap.xml` return **404**. If any of them is still submitted in GSC → Sitemaps, remove it there. See change #8.
- **Minor:** no `<lastmod>` values. Optional to add; not blocking.

---

## G. Other indexing checks

- **The 2 noindexed pages:**
  - `404.html`: intentional.
  - `/thank-you`: intentional. It's the post-form-submission conversion page and shouldn't be indexed.
- **Blog archive (`/blog`):** returns 200. It lists all 6 posts, is linked from the header and footer nav, and is in the sitemap. `/blog/` and `/blog.html` each reach it in 1 hop (308).

  It was "previously reported broken" because `/blog` only launched on 2026-09-11 (commit `7feb49a`). Before that, the old WP blog URLs had nothing to land on. **Not broken now. [verify live]**

---

## H. Homepage change check (report only, no edits made)

- **Commits to `index.html` since 2026-08-15:** 22. They cover design and layout changes, tracking tags, the favicon, Turnstile, and the heading fix (the "Clients" `h3` became an `h2`). **None removed a list of services.** A diff from the first commit (2026-08-17) to today shows no removed service cards.
- **The real loss is the WordPress → static migration itself.** The WP homepage isn't in this repo, so I can't diff it. But the current site barely covers the queries that dropped:

  | Query theme | Where it appears on the site today |
  |---|---|
  | **Bulk storage** | Only in one blog post |
  | **Long-term storage** | Present ("Short or Long Term Options" card, service pages) |
  | **Secure storage** | Homepage and blog |
  | **Retail goods** | Only in one blog post |
  | **Customizable storage** | **Nowhere** |
  | **"Warehousing services"** | **Nowhere**. The site says "warehouse storage services." |

- **Homepage service cards today:** Art Storage · Full Service Warehouse Storage · Short or Long Term Options · Pack / Ship / Store & More.
- **Timing.** Impressions went to zero in mid-September. That matches the WP → static cutover and the 2026-09-16 URL-scheme deploy (commit `1aaace0`). I can't see the DNS cutover date from the repo.
- **Recommendation (content work, needs your approval, not in scope for me to edit):**
  1. Pull the old WP homepage from a backup or the Wayback Machine.
  2. Restore a "Warehousing Services" list covering bulk, long-term, secure, retail goods, and customizable storage on the homepage and/or `/warehouse-services`.

---

## Proposed redirect map (additions and changes only; the other 60 rules are verified fine)

| Old URL | New URL | Reason |
|---|---|---|
| `/contact-us` | `/contact` | Only the slash form had a rule; the no-slash form 404s |
| `/custom-wine-storage/`, `/custom-wine-storage` | `/warehouse-services` | 404 today. The wine and whiskey storage card lives on this page. |
| `/art-courier-transportation-examples/`, no-slash form, and `/feed/` | `/fine-art-installation-removal` | 404 today. This is the art transport and handling page. |
| `/last-minute-holiday-shipping-las-vegas-nv/` (+ no-slash form, `/feed/`) | `/blog-las-vegas-fulfillment-hub` *(or restore, your call)* | Closer topic than `/cross-docking` |
| `/2025-holiday-christmas-shipping-deadlines/` (+ no-slash form, `/feed/`) | `/blog-las-vegas-fulfillment-hub` *(or new 2026 page)* | Same as above |
| `/project/vintage-slot-machines-games/` (+ no-slash form, `/feed/`) | `/antiques-and-auctions` | Vintage slot machines are shown there. Currently → `/warehouse-services`. |
| `/project/leonardo-davinci/` (+ no-slash form, `/feed/`) | `/safe-secure-art-storage` | DaVinci exhibit pack/ship work is shown there. Currently → `/warehouse-services`. |
| `/{live-page}/feed/` for each of the 20 sitemap pages | `/{live-page}` | Parent page instead of the `/blog` catch-all. Single hop. |
| `/embed/` and `/embed/*` | **410 Gone** | Replaces the homepage dump. Needs a Pages Function (see #5). |
| `/sitemap_index.xml`, `/wp-sitemap.xml`, `/page-sitemap.xml`, `/post-sitemap.xml` | `/sitemap.xml` | Optional. Only if GSC still lists these. |

Unchanged on purpose:

- `/category/*`, `/tag/*`, `/author/*` → `/blog`
- `/project/*` catch-all → `/warehouse-services`
- `/wp-content/uploads/*` → 404
- `/alcohol-wine-whiskey/` → `/warehouse-services`

---

## Proposed changes (numbered; nothing done yet)

All site changes go in the **existing** mechanisms: `_redirects` for redirects, and `functions/` only where `_redirects` can't do the job. Rollback is `git revert <commit>` plus a redeploy, because Pages deploys from git. A "DB backup" doesn't apply here: git history is the backup.

1. **Don't flip to trailing slashes** (see §A). Keep the no-slash canonical, which is already enforced in 1 hop.
2. **`_redirects`:** add `/contact-us` → `/contact`.
3. **`_redirects`:** add the `/custom-wine-storage` and `/art-courier-transportation-examples` rules from the map above.
4. **`_redirects`:**
   - Retarget `/project/vintage-slot-machines-games/` → `/antiques-and-auctions`.
   - Retarget `/project/leonardo-davinci/` → `/safe-secure-art-storage`.
   - Retarget the two holiday URLs per your decision on §B.
5. **`/embed/*` → 410.**
   - `_redirects` can't return 410, so this needs a small Pages Function at `functions/embed/[[path]].js` that returns `410 Gone`.
   - Remove the 10 `/embed/` lines from `_redirects` at the same time, so the behavior is defined in one place.
   - Alternative: leave the current 1-hop 301s to real pages and only change `/embed/` and `/embed/*` to 410.
6. **`_redirects`:** add explicit `/{page}/feed/` → `/{page}` rules for the 20 live pages. Keep `/:slug/feed/` → `/blog` for unknown slugs, since redirecting those to `/:slug` would land on 404s.

   Main `/feed/`: currently → `/blog`. **Decide:** keep that, or let it 404 or return 410.
7. **`seo-audit.md` and `seo-phase1-audit.md` are publicly served.** They're the likely source of the literal `/wp-content/uploads/*` URL, and they list internal findings. Fix with one of:
   - (a) add a `_headers` file with `X-Robots-Tag: noindex` for `/*.md`, or
   - (b) move docs to a `docs/` folder and set the Pages build output directory to exclude it. This option also needs a Cloudflare dashboard change.

   The CHANGELOG and CSV requested for Phase 3 would have the same exposure.
8. **GSC → Sitemaps:** remove any old WP sitemap entries. Optionally add the old sitemap redirects above.
9. **`robots.txt`:** remove the `Disallow: /cdn-cgi/l/email-protection` line, per your instruction. Alternative (**Cloudflare dashboard**): turn off Scrape Shield → Email Address Obfuscation. The site already writes `mailto:` links plainly, so that stops the URL being generated at all.
10. **Cloudflare dashboard [verify live]:**
    - Review Redirect Rules, Page Rules, and Bulk Redirects for WP-era rules that duplicate or conflict with `_redirects`.
    - Confirm the `www` → apex redirect is a single hop.
    - Purge the cache after deploy.
11. **Author account:** on any surviving WP install, delete or rename the account behind `drwebinsteingmail-com` (§E). Nothing to change on this site.
12. **Content (report only, needs your go-ahead):** restore a "Warehousing Services" section (bulk, long-term, secure, retail goods, customizable storage) on the homepage or `/warehouse-services`.
13. **Optional:** add `<lastmod>` to `sitemap.xml`.

### Phase 2 brief items that don't apply to this platform

| Brief item | Status |
|---|---|
| #1 trailing slash | See change #1. It would loop. |
| #2 `wp search-replace` | No DB. Internal links are already clean (0 hit a redirect). |
| #5 `feed_links` / `wp_head` | No feed `<link>` tags exist |
| #7 SEO-plugin noindex / `user_nicename` | No author archives exist; they already 301 |
| #9 blog archive | Not broken |
| #10 "regenerate sitemap" | It's hand-maintained and already clean |
| #11 WP cache plugin | None; Cloudflare purge only |

---

## GSC notes (for after Phase 2)

- **"Page with redirect":** expected and healthy. These are the WP-era slash and `.html` URLs now 301/308-ing to canonicals. **Don't validate** this report; it's informational and clears on its own as Google recrawls.
- **"Not found (404)":** validate after Phase 2 deploys. Before that, check "Last crawled" on each URL; many were likely crawled before the 2026-09-16 and 2026-09-17 fixes.
