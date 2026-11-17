# Adding a photo shoot

1. **Drop the full-size photos in a new folder** under `originals/`, named after the shoot
   (lowercase, dashes), with photos numbered `01.jpg`, `02.jpg`, ...
   Example: `originals/big-sur-2026/01.jpg`
   (`originals/` stays on your computer only; git ignores it. Keep a backup somewhere safe.)

2. **Make the web versions:**

       sh tools/optimize.sh big-sur-2026

   This writes the 1800px viewer images and 760px thumbnails into `images/shoots/big-sur-2026/`.
   Run it with no name to process every shoot (already-made files are skipped).

3. **Add the shoot to `shoots.js`.** Copy an existing block and edit it. The order in the file is the order on the page.

   | field | meaning |
   |---|---|
   | `slug` | the folder name from step 1 |
   | `title`, `year` | shown on the card (`year` can be `""`) |
   | `category` | `portraits`, `landscapes`, `events`... a new one automatically gets its own filter button |
   | `altBase` | description used for the photos' alt text ("Big Sur landscape" becomes "Big Sur landscape 1", ...) |
   | `cover` | which photo is the card cover |
   | `coverPosition` | where to focus the crop, `"50% 20%"` keeps heads in frame (x% y%) |
   | `layout` | optional: `"wide"` for a wide card, `"wide-mobile"` for wide on phones only |
   | `accent` | puzzle-piece color: rose, lavender, sky, green, tangerine, gold, ocean |
   | `photos` | file numbers in display order, e.g. `["01","02","03"]`; use `{ "file": "01", "alt": "..." }` for custom alt text |

4. **Preview** by double-clicking `photography.html` (no server needed).

5. **Commit** `images/shoots/` and `shoots.js`. Nothing in `originals/` is committed.

Tip: for the wide cards (2 per row on desktop) pick a landscape-orientation cover photo.
