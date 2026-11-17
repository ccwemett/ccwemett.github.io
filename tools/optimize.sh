#!/bin/bash
# Makes web-ready copies of your full-size photos.
#
#   originals/<shoot-slug>/01.jpg  ->  images/shoots/<shoot-slug>/01.jpg         (1800px, viewer)
#                                      images/shoots/<shoot-slug>/thumbs/01.jpg  (760px, gallery grid)
#
# Usage:  sh tools/optimize.sh            (all shoots)
#         sh tools/optimize.sh joshua-tree (one shoot)
#
# Folders in originals/ that start with "_" are ignored. Already-made copies are
# skipped unless the original is newer. Uses `sips`, which is built into macOS.

cd "$(dirname "$0")/.." || exit 1
command -v sips >/dev/null || { echo "This tool needs macOS (sips)."; exit 1; }

FULL=1800; THUMB=760; FULLQ=78; THUMBQ=74
made=0; skipped=0

if [ -n "$1" ]; then dirs="originals/$1"; else dirs=$(ls -d originals/*/ 2>/dev/null); fi

for dir in $dirs; do
  dir=${dir%/}; slug=$(basename "$dir")
  case "$slug" in _*) continue;; esac
  [ -d "$dir" ] || { echo "No folder: $dir"; continue; }
  mkdir -p "images/shoots/$slug/thumbs"
  find "$dir" -maxdepth 1 -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.heic' \) | sort | while read -r src; do
    base=$(basename "$src"); base=${base%.*}
    out="images/shoots/$slug/$base.jpg"; thumb="images/shoots/$slug/thumbs/$base.jpg"
    if [ -f "$out" ] && [ -f "$thumb" ] && [ ! "$src" -nt "$out" ]; then continue; fi
    sips -s format jpeg -s formatOptions $FULLQ  -Z $FULL  "$src" --out "$out"   >/dev/null 2>&1
    sips -s format jpeg -s formatOptions $THUMBQ -Z $THUMB "$src" --out "$thumb" >/dev/null 2>&1
    echo "  $slug/$base.jpg"
  done
done
echo "Done. Now add or update the shoot in shoots.json if it is new."
