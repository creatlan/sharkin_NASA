import React from 'react'

const blocks = [
  {
    id: 1,
    paragraphs: [
      `With SharkIn, you can easily explore shark activity near your location by simply selecting a point on the map. Our system will calculate the most likely positions of sharks in the area, helping you gain insight into these fascinating creatures and their behavior.`
    ]
  },
  {
    id: 2,
    paragraphs: [
      `We’re committed to providing 100% authentic and reliable data, described clearly with a user-friendly interface. Our goal is to help protect the oceans by raising awareness about shark conservation and making this information accessible to everyone.`
    ]
  },
  {
    id: 3,
    paragraphs: [
      `If our platform provides valuable insights, share it with others! If you have any suggestions or concerns, feel free to reach out—we're here to help. Thank you for being part of SharkIn, where technology meets ocean conservation!`
    ]
  },
  {
    id: 4,
    paragraphs: [
      `Interactive shark monitoring for ocean health. If our platform provides valuable insights, share it with others! If you have any suggestions or concerns, feel free to reach out—we're here to help.`
    ]
  },
  {
    id: 5,
    paragraphs: [
      `Thank you for being part of SharkIn, where technology meets ocean conservation!`
    ]
  }
]

export default function About(){
  return (
    <section className="about-hero">
      <div className="about-content">
        {blocks.map(block => (
          <div key={block.id} className="about-block">
            {block.paragraphs.map((p, idx) => (
              idx === 0
                ? <h2 key={idx} className="about-h2">{p}</h2>
                : <p key={idx} className="about-paragraph">{p}</p>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
