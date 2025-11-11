import React from "react";
import LightGallery from "lightgallery/react";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

import lgZoom from "lightgallery/plugins/zoom";
import lgThumbnail from "lightgallery/plugins/thumbnail";

const AwardsAndRecongnition = () => {
  return (
    <div>
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-12 text-center mb-12">
            <h2 className="main-title-center">Awards & Recognitions</h2>
          </div>
        </div>

        {/* <div className='accreds-recognitions'>
            <div className='row'>
              <div className='col-lg-3'>
                <div className='accreds-card'>
                    <img src="https://placehold.co/300x300/EEE/31343C" alt="" title="" />
                    <div className='accreds-card-info'>
                        <h3>Name Place holder</h3>
                        <p>Designation</p>
                    </div>
                </div>
              </div>

              <div className='col-lg-3'>
                <div className='accreds-card'>
                    <img src="https://placehold.co/300x300/EEE/31343C" alt="" title="" />
                    <div className='accreds-card-info'>
                        <h3>Name Place holder</h3>
                        <p>Designation</p>
                    </div>
                </div>
              </div>

              <div className='col-lg-3'>
                <div className='accreds-card'>
                    <img src="https://placehold.co/300x300/EEE/31343C" alt="" title="" />
                    <div className='accreds-card-info'>
                        <h3>Name Place holder</h3>
                        <p>Designation</p>
                    </div>
                </div>
              </div>

              <div className='col-lg-3'>
                <div className='accreds-card'>
                    <img src="https://placehold.co/300x300/EEE/31343C" alt="" title="" />
                    <div className='accreds-card-info'>
                        <h3>Name Place holder</h3>
                        <p>Designation</p>
                    </div>
                </div>
              </div>
            </div>
 
        </div> */}
        <div className="container awards-gallery">
          <div className="row">
            <LightGallery plugins={[lgZoom, lgThumbnail]} speed={500}>
              <a href="https://res.cloudinary.com/sdk28cdn/image/upload/v1761464677/agastya/Agastya-Awards-1.jpg">
                <img
                  src="https://res.cloudinary.com/sdk28cdn/image/upload/v1761464677/agastya/Agastya-Awards-1.jpg"
                  alt="…"
                />
              </a>
              <a href="https://res.cloudinary.com/sdk28cdn/image/upload/v1761464677/agastya/Agastya-Awards-2.jpg">
                <img
                  src="https://res.cloudinary.com/sdk28cdn/image/upload/v1761464677/agastya/Agastya-Awards-2.jpg"
                  alt="…"
                />
              </a>
              <a href="https://res.cloudinary.com/sdk28cdn/image/upload/v1761464677/agastya/Agastya-Awards-3.jpg">
                <img
                  src="https://res.cloudinary.com/sdk28cdn/image/upload/v1761464677/agastya/Agastya-Awards-3.jpg"
                  alt="…"
                />
              </a>
              <a href="https://res.cloudinary.com/sdk28cdn/image/upload/v1761464677/agastya/Agastya-Awards-4.jpg">
                <img
                  src="https://res.cloudinary.com/sdk28cdn/image/upload/v1761464677/agastya/Agastya-Awards-4.jpg"
                  alt="…"
                />
              </a>
              <a href="https://res.cloudinary.com/sdk28cdn/image/upload/v1761464677/agastya/Agastya-Awards-5.jpg">
                <img
                  src="https://res.cloudinary.com/sdk28cdn/image/upload/v1761464677/agastya/Agastya-Awards-5.jpg"
                  alt="…"
                />
              </a>
              <a href="https://res.cloudinary.com/sdk28cdn/image/upload/v1761464677/agastya/Agastya-Awards-6.jpg">
                <img
                  src="https://res.cloudinary.com/sdk28cdn/image/upload/v1761464677/agastya/Agastya-Awards-6.jpg"
                  alt="…"
                />
              </a>
              <a href="https://res.cloudinary.com/sdk28cdn/image/upload/v1761464677/agastya/Agastya-Awards-7.jpg">
                <img
                  src="https://res.cloudinary.com/sdk28cdn/image/upload/v1761464677/agastya/Agastya-Awards-7.jpg"
                  alt="…"
                />
              </a>

              {/* more items */}
            </LightGallery>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AwardsAndRecongnition;
