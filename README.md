# BINT Film Studio React Website

React single-page official site for BINT Film Studio, rebuilt from the PDF visual system.

## Preview

Install dependencies and start the Vite dev server:

```bash
npm install
npm run dev -- --port 5173
```

Then open:

```text
http://127.0.0.1:5173/
```

## Files

- `src/` - React components, content config, and responsive visual design
- `assets/cover/` - PDF homepage cover exported for the interactive entry screen
- `assets/works-selected/` - 15 selected works from the user-provided folder
- `assets/bloopers/` - 4 work blooper images from the user-provided folder
- `assets/web/` - retained optimized supporting image assets
- `docs/` - production build output for GitHub Pages and EdgeOne
- `edgeone.json` - EdgeOne Pages build and deploy settings
- `scripts/copy-static.mjs` - copies static metadata files into the production output

## Deploy

Create the production build:

```bash
npm run build
```

Then deploy `docs/` to EdgeOne Pages or GitHub Pages.

These settings are already captured in `edgeone.json`:

- Build command: `npm ci && npm run build`
- Output directory: `docs`
- Node.js version: `22.11.0`
- SPA fallback: off
