# Nepali Calendar 2083 — integrated version

This version is based on the supplied `NepaliCalendar-main.zip`.

## Added files

- `calendar-2083.html` — standalone component markup/reference
- `calendar-2083.json` — 2083 BS month/event/sidebar data
- `calendar-2083.css` — isolated styles prefixed with `.np83-`
- `calendar-2083.js` — calendar renderer and sidebar tabs

## Integration

The existing `index.html` has been updated to:

1. Add `📅 पात्रो २०८३` to the existing navbar.
2. Add the 2083 BS calendar section before the converter.
3. Load `calendar-2083.css`.
4. Load `calendar-2083.js` as a Vite ES module.

The original navbar and existing `script.js` are not replaced.

## Run

```bash
npm install
npm run dev
```

Then open the local Vite URL.

## Notes

The calendar component is intentionally isolated. Its classes start with `.np83-`, so it should not overwrite the existing site's `.nav`, `.calendar-*`, `.dropdown`, or other styles.

The JSON contains the supplied 2083 BS month/event/sidebar data. The calendar UI is generated from that JSON rather than hard-coding each date in HTML.
