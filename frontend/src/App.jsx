import React, { useEffect, useState } from 'react'
import './styles/global.css'
import Header from './components/Header'
import Hero from './components/Hero'
import IntroTwoCol from './components/IntroTwoCol'
import MapSection from './components/MapSection'
import ThreeCols from './components/ThreeCols'
import Footer from './components/Footer'
import About from './pages/About'
import Home from './pages/Home'

export default function App(){
  const [route, setRoute] = useState(window.location.hash || '#/')
  useEffect(()=>{
    function onHash(){ setRoute(window.location.hash || '#/') }
    window.addEventListener('hashchange', onHash)
    return ()=> window.removeEventListener('hashchange', onHash)
  },[])

  if(route.startsWith('#/about')){
    return (<div><Header /><About /><Footer /></div>)
  }
  if(route.startsWith('#/maps')){
    return (<div><Header /><Hero /><IntroTwoCol onTry={() => window.location.hash = '#/maps'} /><MapSection /><ThreeCols /><Footer /></div>)
  }

  // default home
  return (
    <div>
      <Header />
      <Home />
    </div>
  )
}
