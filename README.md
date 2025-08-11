# 8‑Bit Adventurer Forge — GitHub → Netlify (Functions + Portraits)

This repo is ready to deploy on Netlify **with serverless functions** for online portraits.

## What you get
- `index.html` — the app (options + portraits + error messages)
- `netlify/functions/portrait.js` — serverless function that calls OpenAI Images
- `netlify.toml` — configured with `functions = "netlify/functions"` and `NODE_VERSION = "18"`
- `manifest.webmanifest`, `service-worker.js`, icons

## One-time setup

### 1) Create a GitHub repo
1. Create a **new repository** on GitHub (public or private).
2. Upload **all files at the root of this folder** (keep the same structure). That means `index.html` at the repo root and the `netlify/` folder included.

### 2) Connect repo to Netlify (imports Functions too)
1. Go to **Netlify → Add new site → Import from Git**.
2. Pick your GitHub repo.
3. **Build settings:**
   - Build command: *(leave empty)*
   - Publish directory: `.`
   - Functions directory: `netlify/functions`
4. Click **Deploy**.

### 3) Add your OpenAI key (for portraits)
1. Netlify → your site → **Site configuration → Environment variables** → **Add a variable**.
2. Name: `OPENAI_API_KEY`
3. Value: `sk-...` (your OpenAI API key)
4. Save.
5. **Trigger a new deploy** (Deploys → Trigger deploy → Deploy site).

### 4) Test the function
- Open: `https://<your-site>/.netlify/functions/portrait`
  - If you see `{"error":"Method Not Allowed"}` — good (function is live).
  - If you see `{"error":"Missing OPENAI_API_KEY on server."}` — env var isn't applied yet → redeploy.
  - If you see an HTML "Page not found" — functions aren't being built → re-check step 2 (Functions directory).

### 5) Use the app
- Visit your site and click **🎲 Roll New Adventurer**.
- If the portrait fails, an error box appears with the server’s message to help debug.

## Updating later
Any time you change files in GitHub (or upload a new version), Netlify redeploys automatically — **functions included**.

## Notes
- This build pins Node 18 for functions via `netlify.toml`.
- Service worker is included; do a **hard refresh** after redeploys.
- Portrait size is 256×256 by default. You can change in `netlify/functions/portrait.js` (`size: "512x512"`), then commit and redeploy.
