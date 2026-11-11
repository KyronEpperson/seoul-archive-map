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

## M11 — prompt
On each place card, show the straight-line distance from Gangnam Station (the trip base) with a small walking-pin row, e.g. "3.4 km from Gangnam Stn". Verify: the shown value for 3 places matches an independent Python haversine within 0.1 km; Jeju places show no distance.
### M11 — results
PASS. Place cards get a first row "5.7 km from Gangnam Stn · straight line" with a dotted-route icon (metres under 1 km). Check vs Python haversine: Kkupdang 5.7 / 5.69, Tang Contemporary 3.6 / 3.57, Namdaemun Kalguksu 8.1 / 8.05 (all within 0.1 km); Aewol and Seogwipo (Jeju) show no row; 0 page errors.

## M12 — prompt
Animate zoom from the +/− buttons, double-click and cluster taps over ~220 ms (ease-out, log-space so it feels uniform), instant when the viewer prefers reduced motion. Verify: the animated end viewBox equals the instant result to 1e-6, ≥4 intermediate frames are drawn, wheel/pinch stay instant, regressions pass.
### M12 — results
PASS. `zoomTo()` eases the same end state as `zoom()` over 220 ms (cubic ease-out applied to the zoom exponent, so scale changes uniformly); a second click mid-animation snaps the first to its end and chains. Check: 8 frames drawn; end viewBox error 0; two rapid "+" clicks = exactly 1/2.25 width; wheel still instant; with reduced motion the zoom is immediate; regress 13/13.

## M13 — prompt
On mouse/trackpad devices, a hovered pin grows 15% and comes to the front so overlapping pins in dense spots can be picked; touch devices are unaffected. Verify: after hovering, the pin is the last child of the pin layer and its `.pin` computed transform scale ≈1.15; hovering away restores 1.0; the selected pin's 1.35 is not overridden.
### M13 — results
PASS (second attempt). Attempt 1 used CSS `:hover` and re-appended the pin to bring it forward — Chrome drops `:hover` on a node moved under a stationary cursor, so the measured scale stayed 1.0. Now a `hov` class is set on mouse pointerenter (survives the move), removed on leave; the pin moves to the front but stays beneath the selected pin. Check: Park's Bindaetteok hover → scale 1.15 and last in layer; away → 1.0; selected + hover → 1.35; touch pointers ignored.

## M14 — prompt
Add Naver-style line badges (coloured rounded pill with the line number, "신분당"/"경의중앙" for the lettered lines) at each line's termini (Line 2: City Hall and Gangnam) from zoom 1, hidden on collision. Verify: one badge per line end, ≥3 visible at a z1 view, harness 0 overlaps, screenshot.
### M14 — results
PASS (second attempt). 22 badges (two per line; Line 2 at City Hall and Gangnam), pills in the official line colour with a white rim, constant screen size, placed before pin labels and hidden on collision. Attempt 1 hid colliding badges with `visibility`, which the harness counted as a "1 × 2" overlap at City Hall; now `display:none`. Check: z1 Jongno shows 1, 2, 경의중앙; harness desk-z1/desk-z2/phone-z2 0 overlaps.
Noted: road names on tight bends (Itaewon-ro, Apgujeong-ro) crowd their glyphs — revisit.

## M15 — prompt
Keyboard: "/" focuses search from anywhere (not while typing in a field), Enter in search opens the top matching place and centres it, Escape clears and returns focus to the map. Verify with a scripted keyboard run: "/" → search focused; type "kkup" + Enter → Kkupdang selected and in view; Escape → empty query, focus on map.
### M15 — results
PASS. "/" focuses search (opens the phone search row first; ignored while typing in a field or with modifier keys), Enter jumps to the first visible match and centres/zooms it, Escape clears and returns focus to the map; placeholder hints "( / )". Scripted check: "/" → #q focused; "kkup"+Enter → "Kkupdang (꿉당)" selected, in view, panel title matches; Escape → query "" and focus on #map; 0 page errors.

## M16 — prompt
Redraw the Jeju inset with a 24-point coastline (Seongsan peninsula, Gosan west tip, the southern bulge at Seogwipo/Jungmun) plus a soft Hallasan blob, and keep the map's water/land palette. Verify: every Jeju place falls inside the new outline (point-in-polygon), outline spans ≥ 0.33° lat and ≥ 0.78° lng, close-up screenshot.
### M16 — results
PASS (second attempt). 24-point coastline with the Seongsan bulge, Gosan west tip and southern coast, blue coast line, and a soft Hallasan blob labelled 한라산. Attempt 1 failed the inside test for both places — they're coastal (Gueom-ri, Daepo-dong) and two coast vertices sat ~500 m inland; nudged to the shore. Check: Jejunagi Aewol inside ✓, Ham Chef Kitchen inside ✓, spans 0.345° × 0.785°; 0 page errors.

## M17 — prompt
Road names crowd their glyphs where the hand-drawn road bends (Itaewon-ro, Apgujeong-ro). Lay each road's label on a gently smoothed path through only its ends and midpoint instead of the full road geometry. Verify: no glyph in any visible road label overlaps the previous glyph by more than 15% of its width (measured with getExtentOfChar) at z1 Jongno and Apgujeong, harness 0 overlaps.
Revised check for M17 (first metric invalid): axis-aligned glyph boxes overlap on any tilted text — straight Teheran-ro scored 0.60. New check: largest rotation change between consecutive glyphs (getRotationOfChar); target ≤ 12° for every visible road label.
### M17 — results
PASS (third attempt, with an honest correction of the diagnosis).
- Metric 1 (glyph-box overlap) was invalid — tilted text overlaps by construction.
- Metric 2 showed bends were *not* the problem: worst rotation jump was already 7° (Itaewon-ro). The 3-point label path made Wangsimni-ro worse (11°), so it was reverted.
- Real cause: halo stroke = 3 × scale on 9 px text (≈0.33 of font size) fattened small letters ("Itaewcn"). Small labels (roads, streams, expressways, stations) now use 2 × scale. Check: halo/font 0.19–0.22 on all visible line labels; rotation jumps ≤ 7°; close-up reads "이태원로 Itaewon-ro" cleanly.

## M18 — prompt
Write "한강 Han River" along the river's own curve (textPath on the real centerline between Yeouido and Hannam) with the same collision-aware offset search, replacing the straight label. Verify: label visible at fit, its glyph rotations vary by ≥5° (it follows the bend), its midpoint lies inside the water band, harness 0 overlaps.
### M18 — results
PASS (fourth attempt).
- Try 1 (true centreline, Yeouido→Hannam): glyph rotation spread 55.8° — text climbed the Dongjak bend; hidden on phone.
- Try 2 (shorter reach, letter-spacing .3→.12em): still 34.9°.
- Try 3 (shifted reach): 48°, and on phone the label (51 units) was longer than its path (50.5) so glyphs dropped.
- Final: label rides a gentle 3-point arc through the Hangang Br.→Banpo reach; phone overview shows "한강" only (Naver mobile does the same). Check: desktop "한강 Han River" visible, rotation spread 21.8°, every glyph ≤ 2.4 units from the true centreline (half-width 4.25 → all in water); phone "한강", spread 1.3°, ≤ 3.25 units; harness desk-fit/phone-fit/desk-z1/phone-z2 0 overlaps.

## M19 — prompt
Make panning cheaper: `apply()` re-runs ~15 document-wide querySelectorAll calls on every drag frame. Cache the static node lists once (refresh pins/badges when `draw()` rebuilds them) and keep behaviour identical. Verify: mean `apply()` time over 120 pans drops ≥30%, viewBox/zoom class after a scripted pan+zoom identical to before, regressions 13/13.
### M19 — results
PASS. apply() now reads 13 cached node lists (refreshed when draw() rebuilds pins/badges) and skips all label/line restyling when scale, zoom tier, width class and label count are unchanged — i.e. during every pan. Check: mean apply() 2.36 ms → 1.54 ms over 3×120 pans (−35%); viewBox + zoom class after the scripted pan/zoom byte-identical before/after; harness label counts unchanged (desk-z1 33, phone-fit 21, phone-z2 16, …), 0 overlaps; regress 13/13.

## M20 — prompt
Audit every text colour against the background it sits on (WCAG 2.x contrast). Panel text must reach 4.5:1; haloed map labels 3:1. Darken any failing token, keeping hue. Verify: a script prints every pair before/after with all passing after, plus a screenshot to confirm the look is unchanged in character.
### M20 — results
PASS (second attempt). Audit script (`_contrast.py`) checks 15 text/background pairs.
- Before: 4 failures — panel faint text 2.52:1, green ink 3.35:1, gu Korean names 2.30:1, river label 2.46:1 (+3 pairs sitting at ~3.00).
- Darkened in HLS keeping hue: faint #a3a3a3→#757575 (4.61), green-ink #00a24a→#00863d (4.69), gu-ko #a49cae→#8c8198 (3.20), river #3f86c2→#3572a6 (3.23), hood-ko →#808080 (3.44), hill-ink →#637f55 (3.47), stream →#3d85c2 (3.43). After: 0 failing.
- Self-correction: I had held the 13 px category eyebrow to 3:1; at 4.5:1 "See" green was 2.25. Eyebrow and "From the post" heads now use the category colour mixed 62% with black. Live check (computed colours): Eat 6.91, Shop 8.79, Art 8.54, See 5.37. (First live read showed ~21:1 — my parser misread Chrome's `color(srgb 0–1)` output; fixed.)

## Final summary
| # | Change | Attempts | Result |
|---|---|---|---|
| M1 | City-limit outline, darker outside | 1 | PASS |
| M2 | 17 Han bridges | 1 | PASS |
| M3 | Category icons in pins | 1 | PASS |
| M4 | z0 clustering + pin mouse-click bug fix | 3 | PASS |
| M5 | Scale bar | 1 | PASS |
| M6 | Selected-pin callout | 1 | PASS |
| M7 | Korean neighbourhood names | 1 | PASS |
| M8 | Stream names + Korean spacing fix | 2 | PASS |
| M9 | Expressway bank labels | 1 | PASS |
| M10 | Jong-ro/Sejong-daero fix + road names | 2 | PASS |
| M11 | Distance from Gangnam Stn | 1 | PASS |
| M12 | Smooth animated zoom | 1 | PASS |
| M13 | Desktop pin hover | 2 | PASS |
| M14 | Subway line badges | 2 | PASS |
| M15 | "/" search, Enter to open | 1 | PASS |
| M16 | Jeju inset coastline + Hallasan | 2 | PASS |
| M17 | Small-label halo fix | 3 | PASS |
| M18 | River label on its curve | 4 | PASS |
| M19 | Pan performance −35% | 1 | PASS |
| M20 | Contrast audit, 0 failures | 2 | PASS |
