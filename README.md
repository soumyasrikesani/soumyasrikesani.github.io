# Soumya Sri Kesani — Portfolio

A Claude-inspired portfolio that **syncs live with GitHub**. It reads your public
repositories from the GitHub API in the browser and groups them into themed
sections (NLP, Forecasting, Machine Learning, Visualization, Geospatial, …).

Push a new repo → it appears automatically. No rebuild, no manual list to update.

## How the auto-sync works

- The page calls `https://api.github.com/users/soumyasrikesani/repos` on load.
- Each repo is sorted into a category by, in order:
  1. an override in `config.js`,
  2. a **GitHub topic** on the repo (best — tag repos on GitHub),
  3. a keyword found in the repo name/description,
  4. otherwise "Other Projects".
- A repo's **website field** (Settings → "Website") becomes its **Live demo** link.

### To make a new project show up nicely
1. Push the repo (public).
2. On GitHub, open the repo → gear icon next to "About" → add **Topics**
   like `nlp`, `forecasting`, `machine-learning`, `visualization`, `geospatial`.
3. Add a one-line **description** and, if you have a Streamlit/Tableau demo,
   paste it into the **Website** field.

That's it — refresh the portfolio.

## Editing content

Everything you'd normally change lives in **`config.js`**:
- `profile` — name, tagline, about, contact links, résumé path
- `skills` — the chips in the About section
- `categories` — theme names, topics, and keywords
- `featured` — repos to spotlight at the top (use exact repo names)
- `overrides` — custom title/description/demo per repo, or `hidden: true`
- `excludeRepos`, `excludeForks`, `excludeArchived`

You rarely need to touch `app.js` or `styles.css`.

## Run locally

Because it uses `fetch`, open it through a tiny web server (not `file://`):

```bash
cd portfolio
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

### Option A — Pages from a branch (simplest)
1. Create a repo, e.g. `portfolio`, and push the contents of this folder.
2. Repo → **Settings → Pages** → Source: **Deploy from a branch** →
   Branch: `main`, folder: `/ (root)` → Save.
3. Live at `https://soumyasrikesani.github.io/portfolio/`.

> Tip: name the repo `soumyasrikesani.github.io` to serve it at the root URL
> `https://soumyasrikesani.github.io/`.

### Option B — Pages via Actions (included)
This folder ships `.github/workflows/deploy.yml`. In **Settings → Pages**, set
Source to **GitHub Actions**. Every push to `main` redeploys.

## Notes
- GitHub's unauthenticated API allows 60 requests/hour per network. A visit is
  one request, so this is plenty; a friendly message shows if a limit is ever hit.
- `.nojekyll` is included so GitHub serves all files as-is.
