const TechnologySection = () => {
  const technologies = [
    {
      id: 1,
      name: "Siemens ARTIS one",
      icon: "🔬",
      description: "Advanced imaging system"
    },
    {
      id: 2,
      name: "Leica M520 Optics",
      icon: "🔍",
      description: "Precision surgical microscope"
    },
    {
      id: 3,
      name: "J&J VELYS Robotic-Assisted Solution",
      icon: "🤖",
      description: "Robotic surgical assistance"
    },
    {
      id: 4,
      name: "Philips IntelliBridge Enterprise",
      icon: "💻",
      description: "Healthcare information system"
    },
    {
      id: 5,
      name: "GE Healthcare Discovery",
      icon: "📡",
      description: "Advanced diagnostic imaging"
    },
    {
      id: 6,
      name: "Stryker Navigation System",
      icon: "🧭",
      description: "Surgical navigation technology"
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-start mb-12">
          <h2 className="main-title mb-12">Our Expert Doctors For The Patients</h2>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          {technologies.map((tech) => (
            <div
              key={tech.id}
              className="technology-card"
            >
              {/* <div className="technology-icon">{tech.icon}</div> */}
              <div className="technology-icon"><img src={'https://placehold.co/100x100/EEE/31343C'} /></div>
              
              <h3 className="technology-name">{tech.name}</h3>
              {/* <p className="text-xs text-gray-600">{tech.description}</p> */}
            </div>
          ))}
        </div>

        {/* <div className="text-center">
          <p className="text-gray-600 text-lg">
            State-of-the-Art Equipment • Technological Excellence • Precision-Driven Tools
          </p>
        </div> */}

 
 


      </div>
      
        <div className="marquee-section section-padding pt-0">
            <div className="mycustom-marque theme-blue-bg">
                <div className="scrolling-wrap">
                    <div className="comm">
                        <div className="cmn-textslide stroke-text"><img src={'https://ex-coders.com/html/digtek/assets/img/has.png'} alt="img" />Technological Excellence</div>
                        <div className="cmn-textslide stroke-text"><img src={'https://ex-coders.com/html/digtek/assets/img/has.png'} alt="img" />Precision Driven Tools</div>
                        <div className="cmn-textslide stroke-text"><img src={'https://ex-coders.com/html/digtek/assets/img/has.png'} alt="img" />State-of-the-Art Equipment</div>
                    </div>
                    <div className="comm">
                        <div className="cmn-textslide stroke-text"><img src={'https://ex-coders.com/html/digtek/assets/img/has.png'} alt="img" />Technological Excellence</div>
                        <div className="cmn-textslide stroke-text"><img src={'https://ex-coders.com/html/digtek/assets/img/has.png'} alt="img" />Precision Driven Tools</div>
                        <div className="cmn-textslide stroke-text"><img src={'https://ex-coders.com/html/digtek/assets/img/has.png'} alt="img" />State-of-the-Art Equipment</div>
                    </div>
                   <div className="comm">
                        <div className="cmn-textslide stroke-text"><img src={'https://ex-coders.com/html/digtek/assets/img/has.png'} alt="img" />Technological Excellence</div>
                        <div className="cmn-textslide stroke-text"><img src={'https://ex-coders.com/html/digtek/assets/img/has.png'} alt="img" />Precision Driven Tools</div>
                        <div className="cmn-textslide stroke-text"><img src={'https://ex-coders.com/html/digtek/assets/img/has.png'} alt="img" />State-of-the-Art Equipment</div>
                    </div>
                    <div className="comm">
                        <div className="cmn-textslide stroke-text"><img src={'https://ex-coders.com/html/digtek/assets/img/has.png'} alt="img" />Technological Excellence</div>
                        <div className="cmn-textslide stroke-text"><img src={'https://ex-coders.com/html/digtek/assets/img/has.png'} alt="img" />Precision Driven Tools</div>
                        <div className="cmn-textslide stroke-text"><img src={'https://ex-coders.com/html/digtek/assets/img/has.png'} alt="img" />State-of-the-Art Equipment</div>
                    </div>
                    
                </div>
            </div>
        </div>
    </section>
  )
}

export default TechnologySection 