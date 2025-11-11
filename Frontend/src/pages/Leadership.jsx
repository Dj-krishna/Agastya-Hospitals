import React from "react";

const Leadership = () => {
  return (
    <div>
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-12 text-center mb-12">
            <h2 className="main-title-center">Leadership</h2>
          </div>
        </div>

        <div className="leadership-team">
          <div className="row">
            <div className="col-lg-3">
              <div className="leadership-card">
                <img
                  src="https://res.cloudinary.com/sdk28cdn/image/upload/v1761463445/agastya/dr-praveen-reddy.png"
                  alt=""
                  title=""
                />
                <div className="leadership-info">
                  <h3>Dr Praveen Reddy P</h3>
                  <p>MBBS, MS.Ortho</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="leadership-card">
                <img
                  src="https://res.cloudinary.com/sdk28cdn/image/upload/v1761463445/agastya/dr.ram-kamal.png"
                  alt=""
                  title=""
                />
                <div className="leadership-info">
                  <h3>Dr Ram Kamal Sagapuram</h3>
                  <p>MS (Orthopaedics), Fellow in Joint Replacement Surgery</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="leadership-card">
                <img
                  src="https://res.cloudinary.com/sdk28cdn/image/upload/v1761463445/agastya/dr-sudhakar-reddy.png"
                  alt=""
                  title=""
                />
                <div className="leadership-info">
                  <h3>Dr H. Sudhakar Reddy PT</h3>
                  <p>MPT, MIAP, MTFI, CDRS, CBCT</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="leadership-card">
                <img
                  src="https://placehold.co/600x800/EEE/31343C"
                  alt=""
                  title=""
                />
                <div className="leadership-info">
                  <h3>Anil Kumar</h3>
                  {/* <p>Designation</p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leadership;
