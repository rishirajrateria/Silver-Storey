# Osha Jewels — Proposal & Quote (September 2026)

Client-facing quote PDF, built from `spec.json` (copy + numbers) and `template.html` (layout).

Rebuild:

```bash
pip install jinja2 pymupdf
NODE_PATH=$(npm root -g) python3 build.py Osha-Jewels-Quote-Sept-2026.pdf
```

Requires a global Playwright install with Chromium. Totals are computed in `build.py`; edit amounts only in `spec.json`.
