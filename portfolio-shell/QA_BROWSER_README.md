# KSW browser QA runner (Cycle 41)

The previous QA loops could not validate real layouts because the execution environment blocks Chromium navigation to localhost. This run adds a reproducible HTTP-based browser QA runner **without modifying the portfolio design**.

Run from `portfolio-vscode/`:

```bash
python -m pip install playwright
python -m playwright install chromium
python qa-browser.py
```

If you have a system Chromium and the Playwright browser is unavailable, set `KSW_CHROMIUM` to the browser executable path.

The runner serves `dist/` on a temporary localhost port, checks LG/IVI/CAFEKOK/OFFER at 1440/1280/768/390, captures the cover screenshot, and writes `qa-browser-results/results.json`. Checks include HTTP status, horizontal overflow, already-loaded broken images, one cover CTA, matching cover/floating destinations, initial button visibility, scrolled button visibility, and JS page errors. A passing run does **not** prove full accessibility or all interactions; manual full-page QA remains necessary. The script does not deploy or modify site files.

Cycle 41 execution in the automation container: 16/16 navigations blocked with `ERR_BLOCKED_BY_ADMINISTRATOR`; therefore **Before/After images not generated**. `qa-browser-results/` is intentionally excluded from the integrated ZIP because it contains only failed local execution logs.

Preserved: all Cycle 40 source and media, shell, prototype, research text, GitHub main and Netlify deployment. Next priority: execute the runner on a workstation with browser access and fix the first verified layout defect, then capture matched before/after images.
