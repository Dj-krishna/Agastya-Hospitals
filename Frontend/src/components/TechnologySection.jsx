// import siemensIcon from "../assets/images/";

const TechnologySection = () => {

  const technologies = [
    {
      id: 1,
      name: "Siemens SOMATOM go.Now CT Scan",
      icon: "https://res.cloudinary.com/sdk28cdn/image/upload/v1758394529/agastya/tech-siemens-somatom.webp",
      description: "Advanced imaging system"
    },
    {
      id: 2,
      name: "Olympus Endoscope",
      icon: "https://res.cloudinary.com/sdk28cdn/image/upload/v1758394590/agastya/tech-olympus.webp",
      description: "Precision surgical microscope"
    },
    {
      id: 3,
      name: "Siemens ARTIS one Edition X Cathlab",
      icon: "https://res.cloudinary.com/sdk28cdn/image/upload/v1758394660/agastya/tech-siemens.webp",
      description: "Robotic surgical assistance"
    },
    {
      id: 4,
      name: "J & J VELYS Robotic-Assidted Solutions",
      icon: "https://res.cloudinary.com/sdk28cdn/image/upload/v1758394661/agastya/tech-jandj.webp",
      description: "Healthcare information system"
    },
    {
      id: 5,
      name: "Arthrex Synergy Vision Imaging ",
      icon: "https://res.cloudinary.com/sdk28cdn/image/upload/v1758394661/agastya/tech-arhrex.webp",
      description: "Advanced diagnostic imaging"
    },
    {
      id: 6,
      name: "Leica M520 Optics OptiChrome Microscope",
      icon: "https://res.cloudinary.com/sdk28cdn/image/upload/v1758394661/agastya/tech-leica.webp",
      description: "Surgical navigation technology"
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-start mb-5">
          <h2 className="main-title mb-5">Healthcare Through Advanced Technologies</h2>
        </div>
      </div>
      <div className="container">
        <div className="row">
          
            {technologies.map((tech) => (
              <div className="col-lg-4">
              <div
                key={tech.id}
                className="technology-card"
              >
                <div className="technology-icon"><img src={tech.icon} alt={tech.name} width="80" /></div>
                {/* <div className="technology-icon"><img src={'https://placehold.co/100x100/EEE/31343C'} /></div> */}
                
                <h3 className="technology-name">{tech.name}</h3>
                {/* <p className="text-xs text-gray-600">{tech.description}</p> */}
              </div>
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