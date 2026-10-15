# Cloudflare zone hardening — lasvegaswarehouse.com

Applied via API on 2026-10-15 for zone `lasvegaswarehouse.com`
(account `904c2c5d3fb5696a0c9a003912ecb4a5`, zone id `80d1bada1990b5ac838e851914a30513`):

| Setting | Value applied |
| --- | --- |
| Always Use HTTPS | **on** |
| Minimum TLS version | **1.2** |
| HSTS (Strict-Transport-Security) | **enabled**, max-age 15552000 (180 days), includeSubDomains, nosniff |
| Email Address Obfuscation | **off** |
| SSL mode | Full (unchanged) |

## Dashboard path (verify / adjust)

1. Cloudflare Dashboard → **lasvegaswarehouse.com**
2. **SSL/TLS → Overview** — encryption mode: Full or Full (strict)
3. **SSL/TLS → Edge Certificates** — Always Use HTTPS; Minimum TLS 1.2; HSTS
4. **Scrape Shield → Email Address Obfuscation** — Off

Pages project `las-vegas-warehouse` deploys from GitHub branch **main**.
