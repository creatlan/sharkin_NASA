from flask import Flask, jsonify, request
from flask_cors import CORS
import os

# Make Earth Engine optional so the microservice can run in mock mode
try:
    import ee
except Exception:
    ee = None

app = Flask(__name__)
CORS(app)

# Expected env variables:
# GEE_SERVICE_ACCOUNT - service account email
# GEE_PRIVATE_KEY_PATH - path to JSON key file

SERVICE_ACCOUNT = os.environ.get('GEE_SERVICE_ACCOUNT')
KEY_PATH = os.environ.get('GEE_PRIVATE_KEY_PATH', './service-account.json')

initialized = False


def initialize_ee():
    global initialized
    if initialized:
        return
    if not SERVICE_ACCOUNT:
        app.logger.warning('GEE_SERVICE_ACCOUNT not set; running in mock mode')
        initialized = False
        return
    if ee is None:
        app.logger.warning('earthengine-api not installed; running in mock mode')
        initialized = False
        return
    try:
        # Authenticate with service account
        credentials = ee.ServiceAccountCredentials(SERVICE_ACCOUNT, KEY_PATH)
        ee.Initialize(credentials)
        initialized = True
        app.logger.info('Earth Engine initialized')
    except Exception as e:
        app.logger.exception('Failed to initialize Earth Engine: %s', e)
        initialized = False


@app.route('/health')
def health():
    return jsonify({'ok': True})


@app.route('/ndvi')
def ndvi():
    # Query params: bbox (minLng,minLat,maxLng,maxLat), dateStart, dateEnd
    bbox = request.args.get('bbox')
    date_start = request.args.get('dateStart') or '2020-06-01'
    date_end = request.args.get('dateEnd') or '2020-08-31'

    initialize_ee()

    if not initialized:
        # Return mock polygon when GEE not initialized
        geojson = {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'properties': {'ndvi_mean': 0.45},
                    'geometry': {
                        'type': 'Polygon',
                        'coordinates': [[
                            [-122.45, 37.74],
                            [-122.45, 37.8],
                            [-122.4, 37.8],
                            [-122.4, 37.74],
                            [-122.45, 37.74]
                        ]]
                    }
                }
            ]
        }
        return jsonify(geojson)

    try:
        # If bbox provided, parse to ee.Geometry. If not, support a center+buffer_km
        # so callers can specify a center point and a radius in kilometers.
        # Query param supported: center=lng,lat and buffer_km (float, default 5)
        center = request.args.get('center')
        try:
            if bbox:
                parts = [float(x) for x in bbox.split(',')]
                if len(parts) != 4:
                    raise ValueError('bbox must have 4 comma-separated values: minLng,minLat,maxLng,maxLat')
                minLng, minLat, maxLng, maxLat = parts
                geom = ee.Geometry.Rectangle([minLng, minLat, maxLng, maxLat])
            elif center:
                # center provided as 'lng,lat' and optional buffer_km to define a square bbox
                parts = [float(x) for x in center.split(',')]
                if len(parts) != 2:
                    raise ValueError('center must be two comma-separated values: lng,lat')
                center_lng, center_lat = parts
                # buffer in kilometers (defaults to 5km)
                buffer_km = float(request.args.get('buffer_km') or request.args.get('radius_km') or 5.0)
                import math
                # Approximate conversions: 1 deg latitude ~= 111 km; longitude scaled by cos(lat)
                delta_lat = buffer_km / 111.0
                # use 111.320 km per degree longitude at equator adjusted by latitude
                delta_lng = buffer_km / (111.320 * math.cos(math.radians(center_lat))) if math.cos(math.radians(center_lat)) != 0 else 0
                minLng = center_lng - delta_lng
                maxLng = center_lng + delta_lng
                minLat = center_lat - delta_lat
                maxLat = center_lat + delta_lat
                geom = ee.Geometry.Rectangle([minLng, minLat, maxLng, maxLat])
            else:
                # default bbox
                minLng, minLat, maxLng, maxLat = -122.45, 37.74, -122.4, 37.8
                geom = ee.Geometry.Rectangle([minLng, minLat, maxLng, maxLat])
        except ValueError as ve:
            app.logger.exception('Invalid bbox/center parameter: %s', ve)
            return jsonify({'error': str(ve)}), 400

        # Example NDVI computation using Sentinel-2
        collection = (ee.ImageCollection('COPERNICUS/S2_SR')
                      .filterDate(date_start, date_end)
                      .filterBounds(geom)
                      .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20)))

        def ndvi_fn(img):
            ndvi = img.normalizedDifference(['B8', 'B4']).rename('NDVI')
            return img.addBands(ndvi)

        with_ndvi = collection.map(ndvi_fn)
        ndvi_median = with_ndvi.select('NDVI').median()

        # Reduce to mean over the geometry
        mean_dict = ndvi_median.reduceRegion(ee.Reducer.mean(), geom, 30)
        ndvi_mean = mean_dict.get('NDVI').getInfo()

        # For demonstration: export a simple polygon (the bbox) with ndvi_mean property
        feature = {
            'type': 'Feature',
            'properties': {'ndvi_mean': ndvi_mean},
            'geometry': {
                'type': 'Polygon',
                'coordinates': [[
                    [minLng, minLat],
                    [minLng, maxLat],
                    [maxLng, maxLat],
                    [maxLng, minLat],
                    [minLng, minLat]
                ]]
            }
        }
        return jsonify({'type': 'FeatureCollection', 'features': [feature]})
    except Exception as e:
        app.logger.exception('GEE request failed: %s', e)
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    # For local testing only
    initialize_ee()
    app.run(host='0.0.0.0', port=5001, debug=True)
