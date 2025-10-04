GEE Python microservice (Flask)

Setup (recommended inside a virtualenv):

1) Create virtualenv and install:

```powershell
cd "c:\imp program\NASA_hack\backend\gee_microservice"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

2) Prepare credentials:
- Create a Google Cloud service account with Earth Engine access.
- Download the JSON private key and save it to `service-account.json` (or another path).
- Create a `.env` (or set env vars) matching `.env.example`:
  - `GEE_SERVICE_ACCOUNT` — service account email
  - `GEE_PRIVATE_KEY_PATH` — path to JSON key file

3) Run microservice:

```powershell
# from the microservice folder with venv activated
$env:GEE_SERVICE_ACCOUNT = 'your-sa@project.iam.gserviceaccount.com'
$env:GEE_PRIVATE_KEY_PATH = 'C:\path\to\service-account.json'
python app.py
```

Endpoints:
- `GET /health` — check service
- `GET /ndvi?bbox=minLng,minLat,maxLng,maxLat&dateStart=YYYY-MM-DD&dateEnd=YYYY-MM-DD` — returns GeoJSON with ndvi_mean property (mock if GEE not initialized)

Notes:
- The microservice uses `earthengine-api` and expects service-account flow.
- `earthengine-api` requires initial OAuth setup for service accounts; follow Google docs if you see permission errors.
