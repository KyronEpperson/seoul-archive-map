# Seoul Archive Map

Single-page map of saved Seoul posts (Instagram, TikTok, articles) with glowing points.
Click a point to see name, location, menu/foods or clothing items.

## Files
- `seoul-archive.html` – the app (vanilla JS/SVG, single file)
- `places.js` – place records, extras and district anchors
- `basemap.js` – hand-built vector base map (river, parks, subway lines, labels)
- `links.json` – saved post links (from Gmail self-sends)
- `frames.json`, `frames/` – TikTok frame readings and thumbnails
- `extract_mime.py` – decodes Gmail RAW messages and writes image attachments
- `validate.js` – schema checks for places and stations
- `harness.js`, `run.sh`, `regress.sh`, `_t*.js` – Playwright render and regression suites (13/13)
- `onepager.html`, `seoul-archive-places.png` – one-page print

## Known limits
- Audio and video are not available from the sandbox; 159 untagged links are text-only.
- Base map is hand-built; a browser-captured base map is still pending.

## Run
Serve the folder over HTTP (e.g. `python3 -m http.server 8765`) and open `seoul-archive.html`.
Tests: `bash regress.sh`.
