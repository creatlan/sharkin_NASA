import React, { useEffect, useState } from 'react'
import Map from './components/Map'
import axios from 'axios'

export default function App() {
  const [geojson, setGeojson] = useState(null)
  const [loading, setLoading] = useState(false)
  const [bbox, setBbox] = useState('-122.45,37.74,-122.4,37.8')
  const [dateStart, setDateStart] = useState('2020-06-01')
  const [dateEnd, setDateEnd] = useState('2020-08-31')
  const [center, setCenter] = useState(null) // [lng, lat]
  const [bufferKm, setBufferKm] = useState(2)
  const [shapeType, setShapeType] = useState('circle') // 'circle' or 'rect'

  async function fetchNdvi(opts = {}) {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      const usedBbox = opts.bbox ?? bbox
      const usedDateStart = opts.dateStart ?? dateStart
      const usedDateEnd = opts.dateEnd ?? dateEnd
      const usedCenter = opts.center ?? (center ? `${center[0].toFixed(6)},${center[1].toFixed(6)}` : null)
      const usedBufferKm = opts.buffer_km ?? opts.bufferKm ?? bufferKm
      if (usedBbox) params.set('bbox', usedBbox)
      if (usedCenter) params.set('center', usedCenter)
      if (usedBufferKm != null) params.set('buffer_km', String(usedBufferKm))
      if (usedDateStart) params.set('dateStart', usedDateStart)
      if (usedDateEnd) params.set('dateEnd', usedDateEnd)

      const url = '/api/ndvi' + (params.toString() ? ('?' + params.toString()) : '')
      const res = await axios.get(url)
      setGeojson(res.data)
    } catch (e) {
      console.error(e)
      alert('Failed to fetch NDVI data from backend. See console.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNdvi()
  }, [])

  function handleMapClick([lng, lat]) {
    // Fill bbox as a point bbox: lng,lat,lng,lat (client expects minLon,minLat,maxLon,maxLat)
    const formatted = `${lng.toFixed(6)},${lat.toFixed(6)},${lng.toFixed(6)},${lat.toFixed(6)}`
    setBbox(formatted)
    // keep track of center and request NDVI for a buffer around the clicked point
    setCenter([lng, lat])
    fetchNdvi({ center: `${lng.toFixed(6)},${lat.toFixed(6)}`, buffer_km: bufferKm })
  }

  return (
    <div className="app">
      <header>
        <h1>GEE + React demo</h1>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <input style={{width:340}} value={bbox} onChange={e => setBbox(e.target.value)} />
          <input type="date" value={dateStart} onChange={e => setDateStart(e.target.value)} />
          <input type="date" value={dateEnd} onChange={e => setDateEnd(e.target.value)} />
            <label style={{display:'flex', alignItems:'center', gap:6}}>buffer km:
              <input type="number" value={bufferKm} min={0} step={0.5} onChange={e => setBufferKm(Number(e.target.value))} style={{width:80}} />
            </label>
            <label style={{display:'flex', alignItems:'center', gap:6}}>shape:
              <select value={shapeType} onChange={e => setShapeType(e.target.value)}>
                <option value="circle">circle</option>
                <option value="rect">rect</option>
              </select>
            </label>
            <button onClick={() => fetchNdvi({bbox, dateStart, dateEnd})} disabled={loading}>{loading ? 'Loading...' : 'Fetch NDVI'}</button>
        </div>
      </header>
      <main>
  <Map geojson={geojson} onMapClick={handleMapClick} center={center} bufferKm={bufferKm} shapeType={shapeType} />
        <div style={{padding:'8px 12px', color:'#444'}}>
          Click on the map to drop a point; its coordinates will be filled into the bbox input as "lng,lat,lng,lat".
        </div>
      </main>
    </div>
  )
}
