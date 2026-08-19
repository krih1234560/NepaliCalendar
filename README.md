# Nepali Calendar 2083

A multi-page Nepali Calendar site. `style.css` and `script.js` are shared
across every page; each tool now lives on its own standalone HTML file.

## Pages

- `index.html` — Hero + main Nepali Calendar (BS ↔ AD, month view). Trimmed
  down to just the calendar; other tools are reachable via the nav/Tools menu
  or the Quick Links sidebar, not shown inline.
- `calendar-2083.html` — Dedicated पात्रो २०८३ month-grid view.
- `converter.html` — BS ↔ AD date converter.
- `unicode.html` — Romanized Nepali → Unicode typing tool.
- `festivals.html` — Nepali festivals 2083.
- `holidays.html` — Nepal public/government holidays 2083.
- `tools.html` — Web Tools hub (date-difference calculator + links to the
  other tools).
- `age-calculator.html` — Age calculator.

## No build step required

`script.js` and `calendar-2083.js` are self-contained — all calendar data
(from `festivals.json`, `holidays.json`, `calendar-2083.json`) and the
`@grahan/calendars` BS↔AD conversion library are bundled directly into them.
This means:

- No `npm install` or `npm run dev`/`build` is needed to use the site.
- You can open any `.html` file directly via `file://` or serve the folder
  with any static file server — everything works either way.

The original unbundled sources (`package.json`, `data/*.json`) are kept in
the project for reference/editing, but are not required at runtime. If you
edit `festivals.json`, `holidays.json`, or `calendar-2083.json`, you'll need
to re-bundle them into `script.js` / `calendar-2083.js` for the changes to
take effect (e.g. with `esbuild script.js --bundle --format=iife
--outfile=script.js --loader:.json=json`).

## Run

Just open `index.html` in a browser, or serve the folder statically:

```bash
python3 -m http.server 8000
```
