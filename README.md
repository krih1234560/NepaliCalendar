# Nepali Calendar 2083

Single-page Nepali Calendar using `index.html`, `style.css`, and `script.js`.

## Sections

- Calendar
- BS ↔ AD converter
- Nepali Unicode
- Festivals 2083
- Holidays 2083
- Date difference tool
- Age calculator
- SEO content for tools

## Holiday architecture

The Holidays section is intentionally **not** a separate page. It lives in `index.html` and is styled by `style.css`, with rendering handled by `script.js`.

The old `holidays.html` and `holidays.js` files have been removed.

Holiday data is stored in:

```text
data/holidays.json
```

Festival data is stored in:

```text
data/festivals.json
```

## Run

```bash
npm install
npm run dev
```

Do not open `index.html` directly with `file://`, because the application loads JSON data with `fetch()`.
