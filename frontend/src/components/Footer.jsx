import React from 'react'

export default function Footer(){
  return (
    <footer className="site-footer">
      <div className="container">
        <h3>MADE BY DIPANTAI</h3>
        <div className="footer-links" style={{marginTop:12}}>
          {/* Insert requested links as a large h1-style element. Hovering will navigate after a short delay. */}
          <h1 style={{fontSize:120, lineHeight:'80px', margin:'8px 0', display:'flex', flexDirection:'column'}}>
            <a
              href="https://github.com/creatlan/sharkin_NASA"
              target="_blank"
              rel="noopener noreferrer"
              style={{cursor:'pointer', color:'inherit', textDecoration:'underline', display:'block', marginBottom:28}}
              title="Open GitHub repository"
              aria-label="Open GitHub repository"
            >
              GIT
            </a>
            <a
              href="mailto:a.suhoverkova@innopolis.university"
              style={{cursor:'pointer', color:'inherit', textDecoration:'underline', display:'block', marginTop:8}}
              title="Send email"
              aria-label="Send email"
            >
              EMAIL
            </a>
          </h1>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',marginTop:24,alignItems:'center'}}>
          <h3 style={{margin:0}}>SHARKIN</h3>
          <h3 style={{margin:0}}>©2025</h3>
        </div>
      </div>
    </footer>
  )
}
