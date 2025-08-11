# 8‑Bit Adventurer Forge v5d — with Portrait Fallback

- Patched portrait size to 1024x1024 (OpenAI API requirement)
- New toggle: "Use Online Portraits" — disable to use local pixel avatars
- Fallback: If API billing limit reached or API unavailable, generates local pixel art avatar

## Deployment
Same GitHub → Netlify steps as before:
- Publish directory: `.`
- Functions directory: `netlify/functions`
- Add env var `OPENAI_API_KEY` in Netlify (only needed if online portraits are used)
