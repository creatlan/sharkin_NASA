import React from 'react'

export default function ThreeCols(){
  return (
    <section className="three-cols">
      <div className="col">
        <h3>PARAM1</h3>
        <div style={{marginTop:12,fontFamily:'Archivo Black, sans-serif',color:'var(--primary)'}}>TEXT TEXT TEXT<br/>TEXT TEXT TEXT<br/>INFO</div>
      </div>
      <div className="col">
        <h3>PARAM2</h3>
        <div style={{marginTop:12,fontFamily:'Archivo Black, sans-serif',color:'var(--primary)'}}>TEXT TEXT TEXT<br/>TEXT TEXT TEXT<br/>INFO</div>
      </div>
      <div className="col">
        <h3>PARAM3</h3>
        <div style={{marginTop:12,fontFamily:'Archivo Black, sans-serif',color:'var(--primary)'}}>TEXT TEXT TEXT<br/>TEXT TEXT TEXT<br/>INFO</div>
      </div>
    </section>
  )
}
