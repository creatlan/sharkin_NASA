import express from 'express'
import cors from 'cors'
import fetch from 'cross-fetch'

const app = express()
app.use(cors())
app.use(express.json())

// Health
app.get('/api/ping', (req, res) => res.json({ ok: true }))

app.get('/api/ndvi', async (req, res) => {
  const microserviceUrl = process.env.GEE_MICROSVC_URL || 'http://localhost:5001/ndvi'
  const query = req.url.split('?')[1] || ''
  try {
    const forwardUrl = microserviceUrl + (query ? ('?' + query) : '')
    console.log('Forwarding NDVI request to microservice:', forwardUrl)
    const r = await fetch(forwardUrl)
    if (!r.ok) {
      // make non-2xx status visible to the catch handler
      throw new Error(`Microservice responded with status ${r.status} ${r.statusText}`)
    }
    const data = await r.json()
    return res.json(data)
  } catch (err) {
    // Log full error to help debugging
    console.warn('Failed to reach GEE microservice, returning mock result:', err && (err.stack || err.message))
    const geojson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { ndvi_mean: 0.45 },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-122.45, 37.74],
                [-122.45, 37.8],
                [-122.4, 37.8],
                [-122.4, 37.74],
                [-122.45, 37.74]
              ]
            ]
          }
        }
      ]
    }
    return res.json(geojson)
  }
})

const port = process.env.PORT || 3001
app.listen(port, () => console.log(`API listening on http://localhost:${port}`))
