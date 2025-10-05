import React from 'react'
import Hero from '../components/Hero'
import IntroTwoCol from '../components/IntroTwoCol'
import ThreeCols from '../components/ThreeCols'
import Footer from '../components/Footer'
import cardEx from '../assets/card_ex.png'

const SHARKS = [
  { id: '01', name: 'BLACKNOSE SHARK', desc: 'THIS SHARK IS EASILY IDENTIFIABLE BY THE DARK TIP ON ITS SNOUT. NO INTERDORSAL RIDGE, BUT IT HAS SMALL PECTORAL FINS, DORSAL FINS WITH SHORT REAR TIPS; THE FIRST IS SMALL, AND THE SECOND IS MODERATELY LARGE.' },
  { id: '02', name: 'BLACKTIP REEF SHARK', desc: 'A MODERATE-SIZED STOCKY BROWNISH GRAY SHARK WITH A SHORT, BLUNTLY ROUNDED SNOUT; BLACK AND WHITE ON TIPS OF FIRST DORSAL FIN AND LOWER CAUDAL FIN LOBE.' },
  { id: '03', name: 'BLACKTIP SHARK', desc: 'ALL FINS EXCEPT ANAL FINS ARE BLACK TIPPED, AND THE SHARK HAS AN INTERDORSAL RIDGE.' },
  { id: '04', name: 'BLUE SHARK', desc: 'THIS SHARK IS BLUE, AND IT IS ONE OF THE MOST BEAUTIFUL SHARKS. IT IS A SLIM, GRACEFUL SHARK WITH A LONG, CONICAL SNOUT, LARGE EYES (NO SPIRACLES), AND LONG, NARROW SCYTHE-SHAPED PECTORAL FINS.' },
]

export default function Home(){
  return (
    <main>
      <Hero />

      <section className="shark-gallery container">
        {SHARKS.map(s => (
          <div className="shark-card" key={s.id}>
            <div className="shark-img">
              <img src={cardEx} alt={s.name} />
            </div>
            <div className="shark-meta">
              <div className="item-num">ITEM: {s.id}</div>
              <h4 className="shark-title">{s.name}</h4>
              <p className="shark-desc">{s.desc}</p>
            </div>
          </div>
        ))}
      </section>

      <IntroTwoCol />
      <ThreeCols />
      <Footer />
    </main>
  )
}
