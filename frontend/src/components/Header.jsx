import React from 'react'

export default function Header(){
  return (
    <header className="site-header">
      <div className="nav">
        <div className="brand"><a href="#/" style={{color:'#fff', textDecoration:'none'}}>HOME</a></div>
        <div className="nav-right">
          <a href="#/about" style={{color:'#fff', textDecoration:'none'}}>ABOUT</a>
          <a href="#/maps" style={{color:'#fff', textDecoration:'none'}}>MAPS</a>
        </div>
      </div>
    </header>
  )
}
