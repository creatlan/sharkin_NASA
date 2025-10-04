# NASA Hack - React + GEE Prototype

This workspace contains a minimal React (Vite) frontend and a small Express backend to prototype integrations with Google Earth Engine (GEE).

Quick start (PowerShell) — relative paths

1) Frontend

```powershell
cd frontend
npm install
npm run dev
# open http://localhost:5173
```

2) Backend (Express)

```powershell
cd backend
npm install
npm run start
# listens on http://localhost:3001
```

3) Python microservice (optional — recommended for real GEE calls)

```powershell
cd backend/gee_microservice
python -m venv .venv
. .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
# set env vars (or copy .env.example -> .env and edit)
$env:GEE_SERVICE_ACCOUNT = 'your-sa@project.iam.gserviceaccount.com'
$env:GEE_PRIVATE_KEY_PATH = 'path\to\service-account.json'
python app.py
# listens on http://localhost:5001
```

Notes

- The frontend proxies `/api` to the Express backend (see `frontend/vite.config.js`).
- The Express backend forwards `/api/ndvi` to the microservice at `http://localhost:5001/ndvi` by default. Override via `GEE_MICROSVC_URL` env var.
- If the microservice is not running or not configured for GEE, it runs in mock mode and returns a sample GeoJSON so the frontend still works.

Quick tests

```powershell
# call via express (frontend expects this)
curl http://localhost:3001/api/ndvi

# call microservice directly
curl "http://localhost:5001/ndvi?bbox=-122.45,37.74,-122.4,37.8&dateStart=2020-06-01&dateEnd=2020-08-31"
```

