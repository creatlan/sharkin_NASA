import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Map from './Map'

export default function MapContainer(){
  const [geojson, setGeojson] = useState(null)
  const [loading, setLoading] = useState(false)
  const [bbox, setBbox] = useState('-122.45,37.74,-122.4,37.8')
  const [dateStart, setDateStart] = useState('2020-06-01')
  const [dateEnd, setDateEnd] = useState('2020-08-31')
  const [center, setCenter] = useState(null)
  const [bufferKm, setBufferKm] = useState(2)

  async function fetchNdvi(opts = {}){
    setLoading(true)
    try{
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
    }catch(e){
      console.error(e)
      alert('Failed to fetch NDVI data from backend')
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{ fetchNdvi() }, [])

  function handleMapClick([lng, lat]){
    const formatted = `${lng.toFixed(6)},${lat.toFixed(6)},${lng.toFixed(6)},${lat.toFixed(6)}`
    setBbox(formatted)
    setCenter([lng, lat])
    fetchNdvi({ center: `${lng.toFixed(6)},${lat.toFixed(6)}`, buffer_km: bufferKm })
  }

  return (
    <div>
      <div style={{height:520}}>
        <Map geojson={geojson} onMapClick={handleMapClick} center={center} bufferKm={bufferKm} containerId="map-full" />
      </div>
      <div className="params container" style={{marginTop:12}}>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <input style={{width:340}} value={bbox} onChange={e=>setBbox(e.target.value)} />
          <input type="date" value={dateStart} onChange={e=>setDateStart(e.target.value)} />
          <input type="date" value={dateEnd} onChange={e=>setDateEnd(e.target.value)} />
          <label>buffer km: <input type="number" value={bufferKm} min={0} step={0.5} onChange={e=>setBufferKm(Number(e.target.value))} style={{width:80}} /></label>
          <button onClick={()=>fetchNdvi({bbox,dateStart,dateEnd})} disabled={loading}>{loading? 'Loading...' : 'Fetch NDVI'}</button>
        </div>
      </div>
    </div>
  )
}
