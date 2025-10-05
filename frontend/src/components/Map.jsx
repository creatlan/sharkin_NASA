import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default function Map({ geojson, onMapClick, center, bufferKm = 2, shapeType = 'circle', containerId = 'map' }) {
  const mapRef = useRef(null)
  const layerRef = useRef(null)
  const markerRef = useRef(null)
  const shapeRef = useRef(null)

  useEffect(() => {
    if (mapRef.current) return
    const map = L.map(containerId, { center: [0, 0], zoom: 2 })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)
    mapRef.current = map

    // click handler to notify parent and show a marker
    map.on('click', (e) => {
      const { lat, lng } = e.latlng
      // place or move marker
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng])
      } else {
        markerRef.current = L.marker([lat, lng]).addTo(map)
      }
      // dispatch a custom event with coords so React parent can hook in
      const ev = new CustomEvent('map-click', { detail: { lng, lat } })
      map.getContainer().dispatchEvent(ev)
    })
  }, [containerId])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    // remove previous geo layer
    if (layerRef.current) {
      try { map.removeLayer(layerRef.current) } catch (e) {}
      layerRef.current = null
    }

    if (!geojson) return

    try {
      const geo = L.geoJSON(geojson, {
        style: feature => ({ color: 'red', weight: 2, fillOpacity: 0.3 })
      }).addTo(map)
      layerRef.current = geo
      try { map.fitBounds(geo.getBounds()) } catch (e) {}
    } catch (e) {
      console.error('Failed to render geojson on map', e)
    }
  }, [geojson])

  // Draw a circle or rectangle around the provided center with bufferKm
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    // remove previous shape
    if (shapeRef.current) {
      try { map.removeLayer(shapeRef.current) } catch (e) {}
      shapeRef.current = null
    }

    if (!center || typeof center[0] !== 'number' || typeof center[1] !== 'number') return
    const [lng, lat] = center
    if (shapeType === 'circle') {
      // bufferKm -> meters
      const circle = L.circle([lat, lng], { radius: bufferKm * 1000, color: 'blue', weight: 1, fillOpacity: 0.05 })
      circle.addTo(map)
      shapeRef.current = circle
    } else {
      // rectangle: approximate degrees using simple conversion similar to backend
      const kmToDegLat = bufferKm / 111.0
      const deltaLat = kmToDegLat
      const deltaLng = bufferKm / (111.320 * Math.cos(lat * Math.PI / 180))
      const bounds = [[lat - deltaLat, lng - deltaLng], [lat + deltaLat, lng + deltaLng]]
      const rect = L.rectangle(bounds, { color: 'blue', weight: 1, fillOpacity: 0.05 })
      rect.addTo(map)
      shapeRef.current = rect
    }
  }, [center, bufferKm, shapeType])

  // Listen for custom DOM event from initialization handler and forward to prop
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    function handler(e) {
      const { lng, lat } = e.detail
      if (typeof onMapClick === 'function') onMapClick([lng, lat])
    }
    const el = map.getContainer()
    el.addEventListener('map-click', handler)
    return () => el.removeEventListener('map-click', handler)
  }, [onMapClick])

  return <div id={containerId} style={{width:'100%', height:'100%'}}></div>
}
