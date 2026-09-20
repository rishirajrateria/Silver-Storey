#!/usr/bin/env bash
# Compress the background videos in public/videos for web delivery and
# generate poster frames. Requires ffmpeg (https://ffmpeg.org/download.html).
#
#   npm run optimize:videos
#
# Overwrites the existing filenames in place so no component changes are
# needed. Originals are backed up to public/videos/originals/ (git-ignored).
set -euo pipefail

cd "$(dirname "$0")/.."
VID=public/videos
mkdir -p "$VID/originals"

command -v ffmpeg >/dev/null || { echo "ffmpeg not found — install it first (brew install ffmpeg / apt install ffmpeg)"; exit 1; }

optimize() {
  local src="$1" height="$2" crf="$3"
  local name; name="$(basename "$src")"
  [ -f "$VID/originals/$name" ] || cp "$src" "$VID/originals/$name"
  echo "→ $name: H.264 ${height}p CRF ${crf}, no audio, faststart"
  ffmpeg -y -loglevel error -i "$VID/originals/$name" \
    -vf "scale=-2:${height}" -c:v libx264 -preset slow -crf "$crf" \
    -profile:v high -pix_fmt yuv420p -movflags +faststart -an "$src"
  ls -la "$src" | awk '{printf "   %.1f MB\n", $5/1048576}'
}

poster() {
  local src="$1" out="$2" at="$3"
  echo "→ poster $out (frame at ${at}s)"
  ffmpeg -y -loglevel error -ss "$at" -i "$src" -frames:v 1 -q:v 4 -vf "scale=-2:1080" "$out"
}

# The office clip now runs BOTH the hero and the footer, so it is the LCP
# element and gets hero-grade settings. At 32 MB unoptimised it is the single
# biggest thing on the home page — this step is not optional before deploying.
optimize "$VID/OFFICE full_1.mp4" 1080 28
poster   "$VID/OFFICE full_1.mp4" "$VID/office-poster.jpg" 2

# No longer referenced by the site; kept so the clip is still available.
optimize "$VID/home_video1.mp4" 1080 28
poster   "$VID/home_video1.mp4" "$VID/home_video1.jpg" 1

echo
echo "Done. Expect the office clip at roughly 3-5 MB, down from 32 MB."
echo "Then set HOME_VIDEO_POSTER in src/features/Hero/media.ts to '/videos/office-poster.jpg'."
echo "Commit the updated files in public/videos (not the originals/ folder)."
