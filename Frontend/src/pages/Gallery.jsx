/*import React from 'react'
const Gallery = () => {
  return (
    <div>Gallery</div>
  )
}
export default Gallery;*/


import React, { useState } from "react";
import LightGallery from "lightgallery/react";

// LightGallery styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

// Plugins
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

const TabGallery = () => {
  // Tabs and their image sets
  const tabs = {
     Infrastructure: [
      { src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-1.jpg", thumb: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-1.jpg", caption: "Infrastructure" },
      { src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468045/agastya/agastya-gallery-2.jpg", thumb: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468045/agastya/agastya-gallery-2.jpg", caption: "Infrastructure" },
      { src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468092/agastya/agastya-gallery-3.jpg", thumb: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468092/agastya/agastya-gallery-3.jpg", caption: "Infrastructure" },
      { src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-4.jpg", thumb: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-4.jpg", caption: "Infrastructure" },
      { src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468073/agastya/agastya-gallery-5.jpg", thumb: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468073/agastya/agastya-gallery-5.jpg", caption: "Infrastructure" },
      { src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-6.jpg", thumb: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-6.jpg", caption: "Infrastructure" },
      { src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-7.jpg", thumb: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-7.jpg", caption: "Infrastructure" },
      { src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-8.jpg", thumb: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-8.jpg", caption: "Infrastructure" },
      { src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-9.jpg", thumb: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-9.jpg", caption: "Infrastructure" },
      { src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-10.jpg", thumb: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-10.jpg", caption: "Infrastructure" },
      { src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-11.jpg", thumb: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-11.jpg", caption: "Infrastructure" },
      { src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-12.jpg", thumb: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-12.jpg", caption: "Infrastructure" },
      { src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-13.jpg", thumb: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-13.jpg", caption: "Infrastructure" },
      { src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-14.jpg", thumb: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-14.jpg", caption: "Infrastructure" },
      { src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-15.jpg", thumb: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-15.jpg", caption: "Infrastructure" },
      { src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-16.jpg", thumb: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-16.jpg", caption: "Infrastructure" },
      { src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-17.jpg", thumb: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-17.jpg", caption: "Infrastructure" },
      { src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-18.jpg", thumb: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-18.jpg", caption: "Infrastructure" },
      { src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-19.jpg", thumb: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-19.jpg", caption: "Infrastructure" },
      { src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-20.jpg", thumb: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468065/agastya/agastya-gallery-20.jpg", caption: "Infrastructure" },      
    ],
 
     Equipment: [
      
      { src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468100/agastya/cathlab.jpg", thumb: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468100/agastya/cathlab.jpg", caption: "Cathlab" },      
      { src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468100/agastya/robotics.jpg", thumb: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468100/agastya/robotics.jpg", caption: "Robotics" },
      { src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468100/agastya/ct_scan.jpg", thumb: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468100/agastya/ct_scan.jpg", caption: "CT Scan" },
      { src: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468101/agastya/arthroscopy.jpg", thumb: "https://res.cloudinary.com/sdk28cdn/image/upload/v1761468101/agastya/arthroscopy.jpg", caption: "Arthroscopy" },
    ],
    // Architecture: [
    //   { src: "https://picsum.photos/id/1003/1200/800", thumb: "https://picsum.photos/id/1003/600/400", caption: "Building" },
    //   { src: "https://picsum.photos/id/1008/1200/800", thumb: "https://picsum.photos/id/1008/600/400", caption: "Cityscape" },
    //   { src: "https://picsum.photos/id/1012/1200/800", thumb: "https://picsum.photos/id/1012/600/400", caption: "Museum" },
    // ],
  };

  const [activeTab, setActiveTab] = useState("Infrastructure");

  return (
    <div className="container mt-5 mb-5">
       

      {/* --- Tabs --- */}
      <div  style={{ textAlign: "center", marginBottom: "20px" }}>
        {Object.keys(tabs).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 20px",
              margin: "5px",
              border: "1px",
              borderStyle:"solid",
              borderRadius: "50px",
              cursor: "pointer",
              background: activeTab === tab ? "#1a365a" : "#fff",
              color: activeTab === tab ? "#fff" : "#333",
              transition: "0.3s",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* --- Gallery --- */}
      <LightGallery
        key={activeTab}
        speed={500}
        plugins={[lgThumbnail, lgZoom]}
        elementClassNames="gallery-grid"
      >
        {tabs[activeTab].map((img, i) => (
          <a
            key={i}
            href={img.src}
            data-sub-html={`<h4>${img.caption}</h4>`}
          >
            <img
              src={img.thumb}
              alt={img.caption}
              loading="lazy"
              style={{
                width: "100%",
                display: "block",
                borderRadius: "8px",
                marginBottom: "15px",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
          </a>
        ))}
      </LightGallery>

      {/* --- Inline CSS for Masonry layout --- */}
      <style jsx>{`
        .gallery-grid {
          column-count: 3;
          column-gap: 15px;
        }

        @media (max-width: 900px) {
          .gallery-grid {
            column-count: 2;
          }
        }

        @media (max-width: 600px) {
          .gallery-grid {
            column-count: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default TabGallery;
