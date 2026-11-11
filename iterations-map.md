# Seoul Archive Map — 20-loop improvement log
Goal: make the map better (closer to Naver Maps in look and use). No network data this round; work from existing layers.
Baseline: 13/13 regress pass, v9 live.

## M1 — prompt
Draw Seoul's city limit as a solid outline (edges used by exactly one gu polygon) and dim land outside it. Verify: one boundary path exists with >100 points, screenshot shows a crisp city edge.
### M1 — results
PASS. Thick underlay of all 25 gu outlines beneath the fills; only the outer half shows, so the city limit reads as a solid purple-grey edge. Outside land darkened (#dedad1). Check: 25 `.cityedge` paths, zoomed-out screenshot shows a continuous boundary, 0 page errors. (Edge-matching approach rejected: per-polygon simplification left 449 unmatched edges.)

## M2 — prompt
Draw ~17 Han River bridges as white roads crossing the water, snapped perpendicular to the real centerline. Verify: 17 bridge paths, each endpoint lies outside the water band, screenshot at zoom 1.
### M2 — results
PASS. 17 bridges (Gayang → Gwangjin) snapped to the nearest real-centerline segment and drawn perpendicular, white with a grey casing, thicker from zoom 1. Check: 17 paths; minimum endpoint offset 6.15 units vs water half-width 4.25 (all ends land on the banks); 0 page errors; zoom-1 screenshot shows Hannam/Dongho/Seongsu crossings.

## M3 — prompt
Replace the white dot inside each pin with a small white category icon (eat fork+knife, shop bag, art frame, see star; tagged pins keep a dot). Verify: every non-zone pin has exactly one `.pinicon` of the right kind; close-up screenshot is legible.
### M3 — results
PASS. Pins carry white glyphs: fork+knife (eat), bag (shop), framed picture (art), star (see), dot (tagged); hollow "tagged by you" pins draw the glyph in the category colour. Check: 36/36 non-zone pins have exactly one `.pinicon` (8 eat, 16 shop, 7 art, 5 see); 3× close-ups legible; 0 page errors.
Noted for later: Jong-ro hand line runs diagonally off Gwanghwamun — fix in a roads pass.

## M4 — prompt
At overview zoom (z0), merge pins whose screen positions fall within 28 px into a green count bubble (≥3 pins); tapping it zooms in on that group. Verify: at fit the Seongsu pile becomes one bubble with the right count, no pin both clustered and visible, tapping the bubble reaches z1+ and the pins reappear.
### M4 — results
PASS (third attempt).
- Attempt 1 failed: tapping a bubble did nothing. Root cause was an existing bug: the map called setPointerCapture on every press, so Chromium retargeted every mouse click to the map background, and **mouse clicks on pins never selected anything** (list-row tests had hidden it). Fix: capture the pointer only once a drag passes 8 px.
- Attempt 2 failed: two bubbles (15 and 3) overlapped at Seongsu. Fix: groups now grow until stable, absorbing pins near the centre or within 0.7·R of any member.
- Final check: desktop fit → one bubble of 18; phone fit → bubbles 5 and 19, 0 overlaps; no clustered pin visible; tap bubble → z1, 0 bubbles, all pins back; pin mouse-click selects "Park's Bindaetteok"; drag still pans; regress 13/13.

## M5 — prompt
Add a Naver-style scale bar (bottom-left; clears the Jeju inset) showing a round distance (50 m … 10 km) that is at most 100 px. Verify: at three zoom levels the bar's pixel width × metres-per-pixel equals its label within 2%.
### M5 — results
PASS. Scale bar bottom-left (beside the Jeju card on desktop, at the edge on phone), picks the largest of 50 m…10 km that fits in 100 px. Check: fit 2 km/90.5 px err 0.04%; z1 500 m/50.9 px err 0.07%; z2 100 m/51.6 px err 0.06%. Independent: Gangnam→Samseong stations computes to 3,357 m (real ≈ 3.3 km).

## M6 — prompt
Show the selected place's name in a white rounded callout above its enlarged pin (Naver style) instead of a plain side label. Verify: exactly one callout when a place is selected, its text matches the place, no label overlaps it (harness), screenshot.
### M6 — results
PASS. Selected place gets a white rounded callout with a pointer, green bold name, soft shadow, sitting above the enlarged pin (and above the dashed ring for area places); the plain side label is suppressed and the callout box is reserved in label placement. Check: Kkupdang selected at z2 → 1 callout, text "Kkupdang", 0 labels intersect it; 0 page errors.

## M7 — prompt
Add Korean names to all 29 neighbourhood labels (e.g. "Seongsu 성수"), styled like the gu labels. Verify: the mapping covers 29/29 hoods, and every visible hood label at z1 carries a Korean tspan; harness shows 0 label overlaps.
### M7 — results
PASS. Neighbourhood labels read "English 한글" (e.g. Euljiro 을지로, Seochon 서촌, Seongsu 성수) with the Korean in a lighter weight. Check: mapping 29/29; at z1 4/4 visible hood labels carry the Korean tspan; harness desk-z1 and phone-z2 0 label overlaps.

## M8 — prompt
Write each stream's name (Korean + English) along its course at zoom ≥1 using textPath, always reading left-to-right, hidden when it collides with other labels. Verify: 6 stream labels exist, ≥2 visible at z1 around Jongno/Seongsu, harness 0 overlaps, screenshot.
### M8 — results
PASS (second attempt). Stream names ("청계천 Cheonggyecheon", "홍제천 Hongjecheon" …) run along each stream via textPath, path direction flipped where needed so text stays upright.
- Attempt 1 failed: every stream label collided around Jongno and was hidden (with `visibility`, which the harness still counted as an overlap). Fix: try offsets 50/30/70/15/85% along the course, hide with `display:none`.
- Also fixed an M7 defect seen in this screenshot: the Korean tspan gap was 3 *map units*, so it widened with zoom (Seochon … 서촌). Now 0.3em. Measured gap: 0.30em at z0 and z1.
- Check: 6 stream labels; at Jongno z1 Cheonggyecheon@70% and Hongjecheon@70% visible; harness desk-z1/desk-z2/phone-z2 0 overlaps; 0 page errors.

## M9 — prompt
Label the riverside expressways along their banks at zoom ≥1: "올림픽대로 Olympic-daero" on the south band and "강변북로 Gangbyeon-bukro" on the north band, placed by the same collision-aware offset search. Verify: both labels visible somewhere in a z1 view of the river, each sits on its own bank (north label y < river centre y), 0 overlaps.
### M9 — results
PASS. Bank lines are the real centerline offset by half the river width + 1.2 units, smoothed; labels ride the yellow bands in dark amber with a yellow halo. Check (z1, Apgujeong): 강변북로 Gangbyeon-bukro visible at 65%, centre y=278 vs river 345 (north ✓); 올림픽대로 Olympic-daero at 58%, y=541 vs river 460 (south ✓); harness desk-z1/desk-z2/phone-z2 0 overlaps.

## M10 — prompt
Fix the hand-drawn Jong-ro and Sejong-daero to follow their real alignments, then label all main roads along their course at zoom ≥1 ("종로 Jong-ro", etc.) with collision-aware placement. Verify: Jong-ro's latitude spread < 0.002°, ≥3 road labels visible in a z1 view of Jongno/Gangnam, 0 overlaps.
### M10 — results
PASS (second attempt; first aborted before writing because a CSS anchor matched twice — the guard did its job). Jong-ro now runs east–west along line 1 (lat spread 0.0009°, was 0.0056°) and Sejong-daero follows Gwanghwamun → City Hall → Seoul Stn. All 10 roads get "한글 English" names along their course at z1+, five offsets tried before hiding. Check: Jongno z1 shows Sejong-daero, Euljiro, Itaewon-ro, Wangsimni-ro; Gangnam z1 shows Teheran-ro, Gangnam-daero, Dosan-daero (+2); harness 0 overlaps on desk-z1/desk-z2/phone-z2.

## Checkpoint after 10
| # | Change | Result |
|---|---|---|
| M1 | City-limit outline, darker outside | PASS |
| M2 | 17 Han bridges | PASS |
| M3 | Category icons in pins | PASS |
| M4 | z0 clustering + **pin-click bug fix** | PASS (3rd try) |
| M5 | Scale bar | PASS |
| M6 | Selected-pin callout | PASS |
| M7 | Korean neighbourhood names | PASS (spacing fixed in M8) |
| M8 | Stream names along courses | PASS (2nd try) |
| M9 | Expressway bank labels | PASS |
| M10 | Road fixes + road names | PASS (2nd try) |
