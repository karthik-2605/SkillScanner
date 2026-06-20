# SkillScanner — Frontend (React + Vite)

The React single-page app for SkillScanner: upload a resume, view predictions,
and manage job postings via the admin panel.

```bash
npm install
cp .env.example .env     # set VITE_API_URL if the backend isn't on :8000
npm run dev              # http://localhost:5173
npm run build            # production build into dist/
```

All API calls go through [`src/api.js`](src/api.js), which reads the backend URL
from `VITE_API_URL`. See the [root README](../README.md) for full setup.
