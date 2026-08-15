# Nepali Calendar

Static Nepali Calendar for GitHub + Cloudflare Pages.

## Features
- BS 2000–2100 calendar navigation using `@sonill/nepali-dates`
- BS ↔ AD conversion
- Nepali numerals and month names
- Festival/event UI
- Approximate moon phase display
- Nepali Unicode helper
- Responsive design
- Basic SEO metadata, canonical URL, Open Graph and WebApplication JSON-LD

## Important data note
The calendar conversion library provides 101 years of BS data (2000–2100). Government/public holidays are not a permanent 101-year list: Nepal's Ministry of Home Affairs publishes yearly notices. Add verified yearly holiday/event records to `EVENTS` in `script.js` rather than inventing future holidays.

Replace `https://example.com` in `index.html`, `tools/unicode.html`, `robots.txt`, and `sitemap.xml` with your real domain before deployment.

The moon-phase display is intentionally labeled approximate. It is not a Panchang/tithi engine.
