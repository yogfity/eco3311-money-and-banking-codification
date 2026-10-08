# ECO3311 · Field Guide

A single-page reference site covering the core concepts of **Money and Banking** (ECO3311, Spring 2026). Compiled from lecture notes and Mishkin, *The Economics of Money, Banking, and Financial Markets*.

## What's inside

- **Eight chapters** — interest rate behavior, risk & term structure, the Federal Reserve, money supply process, tools of monetary policy, conduct of policy, quantity theory, and the MP/AD framework.
- **Interactive elements** — click-to-copy formulas, click-to-reveal quiz answers, ⌘K search across all concepts, scroll-spy navigation.
- **Cheat sheet** — every formula and shifter rule condensed to one screen.

## Stack

Vanilla HTML / CSS / JS. No framework, no build step. Fonts via Google Fonts (Young Serif, Figtree, JetBrains Mono).

## Run locally

Open `index.html` directly in a browser, or serve with any static server:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Deploy to GitHub Pages

1. Create a new repo on GitHub.
2. Push these files to the `main` branch.
3. Repo settings → Pages → Source: `main` / root → Save.
4. Site goes live at `https://<username>.github.io/<repo>/` in ~1–2 minutes.

The `.nojekyll` file is already included to skip Jekyll processing.

## Structure

```
field-guide-site/
├── index.html    # All content
├── styles.css    # All styles
├── script.js     # Interactions (search, copy, scroll spy)
├── README.md
└── .nojekyll
```

## License

Personal study reference. Content synthesized from course lecture notes; not a substitute for the assigned textbook.
