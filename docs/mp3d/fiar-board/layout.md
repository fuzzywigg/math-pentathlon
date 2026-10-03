# FIAR (Division II) board layout: what the official sources show

Researched 2026-10-02. All images are in this folder. Their URLs are in `sources.tsv`. Machine-readable data is in `layout.json`.

## Bottom line
- The real board is **not a 5×5 grid**. It has **40 circular playing spaces** on a square lattice with unit spacing, 9 columns by 7 rows (or 7×9 in portrait), in a stepped octagon/diamond outline.
- The **yellow center is not a playable space**. It is a yellow diamond (a square turned 45°) with a fire-extinguisher graphic, sitting on the lattice point at the exact center. Its 4 corners touch the 4 spaces directly above, below, left and right of the center.
- **Lines connect every pair of neighbouring spaces horizontally, vertically and diagonally** (king-move adjacency). Every lattice cell has an "X". The exception is around the center: **no line runs into the yellow area** from any of its 8 neighbours.
- **One open question:** the 4 diagonals that form the diamond's own border (for example c4r2–c3r3) are drawn as the diamond's red-orange outline. No source says whether they count as connecting lines. See "Unresolved".

## Coordinates (landscape, as in the official product photo and the official YouTube thumbnail)
Columns c0–c8 run left to right and rows r0–r6 run top to bottom. `O` = playing space, `Y` = yellow center (not a space), `.` = nothing.

```
      c0 c1 c2 c3 c4 c5 c6 c7 c8
r0     .  .  .  O  O  O  .  .  .     c3-c5   (3)
r1     .  O  O  O  O  O  O  .  .     c1-c6   (6)
r2     .  O  O  O  O  O  O  O  .     c1-c7   (7)
r3     O  O  O  O  Y  O  O  O  O     c0-c3, c5-c8 (8)
r4     .  O  O  O  O  O  O  O  .     c1-c7   (7)
r5     .  .  O  O  O  O  O  O  .     c2-c7   (6)
r6     .  .  .  O  O  O  .  .  .     c3-c5   (3)
                                     total = 40
```
- The shape has **180° rotational symmetry only. It is NOT mirror-symmetric.** Row r1 is c1–c6 but row r5 is c2–c7, so do not "fix" it into a symmetric shape.
- The printed board art (`DivIIfiarwebcr.jpg`, `Board-FIAR-WEB.png`) is the same layout turned 90°. In that portrait view (7 columns × 9 rows), the rows hold 1, 4 (c2–c5), 5 (c1–c5), 7, 6 + Y, 7, 5 (c1–c5), 4 (c1–c4), 1 spaces. The mapping is portrait (col, row) = (r, 8−c) of landscape. Because the layout has 180° symmetry, the other 90° rotation gives the identical node set.

## Yellow center
- It sits at lattice point c4r3, and it is **0 playing spaces**.
- The diamond's corners touch spaces **c4r2, c3r3, c5r3 and c4r4**. The diamond graphic covers the inner half of each of the 4 cells around c4r3.
- **No line segment** runs from c4r2, c3r3, c5r3, c4r4, c3r2, c5r2, c3r4 or c5r4 into the center. In the photo, the pixel profile from c3r2 or c5r2 toward the center shows plain blue background, then the diamond border. The official art shows the same thing.
- Effect on lines:
  - Row r3 splits into **c0–c3** and **c5–c8**, 4 spaces each, so each can hold a 4-in-a-row.
  - Column c4 splits into r0–r2 and r4–r6, 3 spaces each, so neither can.
  - The two center diagonals split into 2-space pieces.
- This matches the rule text "path cannot cross the central yellow area" and "chips may not be moved across the central yellow area".

## Lines (connections)
- **116 confirmed edges.** These are all king-adjacent pairs of spaces except the 4 diamond-border pairs below. The center is excluded because it is not a node.
  - Horizontal: neighbours in the same row.
  - Vertical: neighbours in the same column.
  - Diagonal: both diagonals of every unit cell whose 4 corners exist.
  - Boundary diagonals along the outline, for example c0r3–c1r2, c0r3–c1r4, c2r1–c3r0, c5r0–c6r1, c7r2–c8r3, c7r4–c8r3, c1r4–c2r5 and c6r5–c5r6.
- **There are no lines to positions where no space exists.** I checked every off-board neighbour. The highest one, c1r4→c0r4 at 0.93, is a flame in the background art; visual inspection shows no line there.
- **4 ambiguous edges (the diamond border):** c4r2–c3r3, c4r2–c5r3, c3r3–c4r4, c5r3–c4r4.
- The full edge list and the per-edge pixel scores are in `layout.json`. The fields are `edges_confirmed`, `edges_ambiguous_diamond_border` and `photo_edge_scores`.

### Straight lines with 4 or more spaces (where a 4-in-a-row can exist)
Labels below are cr pairs (for example 12 = c1r2). These are without the diamond-border edges. The 4 extra lines that appear if those edges count are given further down.

| len | spaces |
|---|---|
| 7 | 12 22 32 42 52 62 72 (row r2) |
| 7 | 14 24 34 44 54 64 74 (row r4) |
| 7 | 30 31 32 33 34 35 36 (col c3) |
| 7 | 50 51 52 53 54 55 56 (col c5) |
| 6 | 11 21 31 41 51 61 (row r1) |
| 6 | 25 35 45 55 65 75 (row r5) |
| 5 | 21 22 23 24 25 (col c2) |
| 5 | 61 62 63 64 65 (col c6) |
| 5 | 12 23 34 45 56 (diag) |
| 5 | 30 41 52 63 74 (diag) |
| 5 | 50 41 32 23 14 (anti-diag) |
| 5 | 72 63 54 45 36 (anti-diag) |
| 4 | 03 13 23 33 (row r3, left of yellow) |
| 4 | 53 63 73 83 (row r3, right of yellow) |
| 4 | 11 12 13 14 (col c1) |
| 4 | 72 73 74 75 (col c7) |
| 4 | 03 14 25 36 (diag) |
| 4 | 13 24 35 46 (diag) |
| 4 | 40 51 62 73 (diag) |
| 4 | 50 61 72 83 (diag) |
| 4 | 30 21 12 03 (anti-diag) |
| 4 | 40 31 22 13 (anti-diag) |
| 4 | 73 64 55 46 (anti-diag) |
| 4 | 83 74 65 56 (anti-diag) |

That makes 24 lines. If the diamond-border diagonals count as lines, 4 more appear and the total is 28:
- 11 22 33 44 55 (5 spaces)
- 31 42 53 64 75 (5 spaces)
- 51 42 33 24 (4 spaces)
- 62 53 44 35 (4 spaces)

## Sources and confidence
| Claim | Source(s) | Confidence |
|---|---|---|
| 40 spaces, exact outline above | (1) official board art `DivIIfiarwebcr.jpg` on mathpentath.org/game-description-division-2/; (2) official top-down product photo `2411_fiar_web.jpg` on mathpentath.org/product/fiartm-complete-game/; (3) official "Board ONLY" image `Board-FIAR-WEB.png`; (4) official Mathematics Pentathlon YouTube thumbnail ("Challenge Clarifications FIAR", youtu.be/3pfZarLD1Gg). All four agree, and I detected the circles programmatically in (1) and (2). | **High** |
| Yellow center is a non-playable diamond at the central point, with corners touching the 4 orthogonal neighbours | Sources (1), (2) and (4), visually and by pixel profile in (1) and (2) | **High** |
| King-adjacency lines between existing spaces (116 edges) | Pixel test on the unwatermarked photo (2): all 116 score at least 0.83 red-line coverage on a straight best-fit offset, and the off-board controls score at most 0.30 apart from one flame artifact. The visual overlay is `annotated_photo_overlay.png`. Source (1) is consistent but its watermark makes pixel scoring noisy. | **High** |
| No lines into the yellow area | Pixel profiles on (2) and (1) | **High** |
| Whether the 4 diamond-border diagonals are playable lines | Not stated in any text found | **Unknown** |
| 7 chips per player, 2 marked | Photo (2) shows exactly 7 red and 7 blue chips, 2 of each with a dot | High (matches the PDFs) |
| Marked-chip dot colour | The PDFs say "yellow dots". Photo (2) and the YouTube thumbnail show **green** dots. | The kit varies; this is cosmetic |

## Unresolved / not found
- **Diamond-border diagonals.** In the photo these 4 node-to-node diagonals coincide with the diamond's thick red-orange outline. There is no separate thin line beside it, and it looks like the diamond's edge. Neither rules PDF (`mp-highlights-division-2.pdf`, 2024 rules; Austin Trinity condensed rules) addresses this. The rules only say no moving or bridging *across* the yellow area. Moving along the edge does not cross it, but it is not clear that a "line" exists there. This needs a product decision, or a question to Math Pentathlon (mathpentathorders@gmail.com, 317-356-6284). I did not contact them.
- **No board diagram in either local PDF.**
  - `pdfimages -list` shows 0 embedded images in both PDFs.
  - The rendered pages are text and tables only. The FIAR page is page 2 of the highlights PDF and page 1 of the Austin Trinity PDF.
- **The full Rule Manual and the instructional videos are paid products.** The manual is sold and the videos are rentals at mathpentath.org/instructional-videos/. I did not access them.
- **Not pursued:** Pinterest, eBay, Etsy, Amazon, archive.org and teacher blogs. Three independent official images already agreed on the layout, and the only open question (the diamond border) is a rule-interpretation issue that a photo cannot settle.
- **Kwatro-Sinko is a different board.** It is an 8-point star with numbered spaces (see `DivIIkwatrosinkowebcr.jpg`). It shares the yellow-center rule but **not the layout**.
- The board's own copyright line in the photo reads "© Copyright 1980, 1986, 1991, 2001, 2011 by Pentathlon Institute, Inc."
