import React, { useState } from 'react'
import cardEx from '../assets/card_ex.png'

export default function IntroTwoCol({onTry}){
  const [clicked, setClicked] = useState(false)

  const handleTry = (e) => {
    // show temporary feedback
    setClicked(true)
    setTimeout(() => setClicked(false), 1500)

    // call external callback if provided
    if (typeof onTry === 'function') onTry(e)

    // scroll to the map section if present
    try {
      const el = (typeof document !== 'undefined') && document.querySelector('.map-section')
      if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch (err) {
      // ignore errors in non-browser environments
    }
  }

  return (
    <section className="intro container" style={{marginTop:0}}>
      <div className="left">
        <div style={{boxShadow:'0 4px 0 rgba(0,0,0,0.1)'}} id="map-preview">
          <img src={cardEx} alt="map preview" style={{width:'100%', height:420, objectFit:'cover', display:'block'}} />
        </div>
      </div>
      <div className="right">
        <div className="terms">
          <h3>TERMS TO USE MAPS:</h3>
          <p>YOU: CHOOSE A POINT ON THE MAP</p>
          <p>WE: CALCULATE POSSIBLE SHARK LOCATIONS NEAR THAT POINT USING NASA SATELLITE DATA AND SHARK TAGGING DATA</p>
          <p>YOU: ADD MORE FILTERS (OR ANY ACTION)</p>
          <p>WE: PROVIDE REAL-TIME SHARK TRACKING AND DATA INSIGHTS</p>
          <p>LET'S FIND SHARKS NEAR YOU AND EXPLORE THE OCEAN'S MYSTERIES!</p>
          <div style={{marginTop:24}}>
            <button className="try-btn" onClick={handleTry}>{'TRY'}</button>
          </div>
        </div>
      </div>
    </section>
  )
}
