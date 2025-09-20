const About = () => {
  return (
    <div className="container mx-auto px-4 pt-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <h1 className="text-center special-title gradient-text">
            Empathetic Care Powered by Cutting-Edge Technology for Your
            Well-being
          </h1>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8 mx-auto text-center">
          <div className="video-container">
            <video width="768" height="400" autoplay>
              <source src="https://res.cloudinary.com/sdk28cdn/video/upload/v1758219748/agastya/agastya-hospital-video.mp4" type="video/mp4"></source>
              <source src="https://res.cloudinary.com/sdk28cdn/video/upload/v1758220909/agastya/agastya-hospital-video-m.webm" type="video/ogg"></source>
            Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>

    <div className="row">
      <div className="col-lg-8 m-auto">
          <div className="aboutus-text">
        <div className="bg-white p-8">
          <p>
            Agastya Hospitals, is a 150 bedded hospital located on converge of 5
            most important routes of twin cities, situated at Omakar Nagar,
            Nagarjuna Sagar Road, L B Nagar, Hyderabad. The project was
            conceived by 4 of the most enterprising Medical Professionals of the
            City.
          </p>
          <p>
            Agastya Hospitals is a Premier multi-specialty tertiary care
            hospital, offering expertise and experience in multiple super
            specialties of the medical field. It is established with a vision of
            emerging as a Hospital of first choice to the patients not only from
            Hyderabad but also from beyond the boundaries of State and the
            Nation. From pursuit of this vision emanates a passion to excel.
          </p>
        </div>
      </div>
      </div>
    </div>


    <div className="row">
      <div className="row">
        <div className="col-lg-12 text-center mb-12">
          <h2 className="main-title-center">Key Features</h2>
        </div>
      </div>

      <div className="row keyfeatures">
        <div className="col-lg-3 coloumn">
          <div className="keyfeatures-card top-curve">
              <h4>Quality Care</h4>
              <p>Our continuous search for best practices in healthcare has lead to our superior quality and performance. We have emerged as ‘leaders in the field’ with our rare and complex procedures</p>
          </div>
        </div>

        <div className="col-lg-3 coloumn">
          <div className="keyfeatures-card bottom-curve">
              <h4>Technology</h4>
              <p>Our continuous search for best practices in healthcare has lead to our superior quality and performance. We have emerged as ‘leaders in the field’ with our rare and complex procedures</p>
          </div>
        </div>

        <div className="col-lg-3 coloumn">
          <div className="keyfeatures-card top-curve">
              <h4>Faclities</h4>
              <p>Our continuous search for best practices in healthcare has lead to our superior quality and performance. We have emerged as ‘leaders in the field’ with our rare and complex procedures</p>
          </div>
        </div>

        <div className="col-lg-3 coloumn">
          <div className="keyfeatures-card bottom-curve">
              <h4>Team</h4>
              <p>Our continuous search for best practices in healthcare has lead to our superior quality and performance. We have emerged as ‘leaders in the field’ with our rare and complex procedures</p>
          </div>
        </div>
      </div>
    </div>

      {/* stats-card d-flex justify-content-between align-items-center flex-wrap gap-0 */}

      <div className="row stats-container">
        <div className="col-lg-3 stats-section">
          <h6>Happy Patients</h6>
          <div className="stat-number">10,000+</div>
        </div>

        <div className="col-lg-3 stats-section">
          <h6>Surgeries Performed</h6>
          <div className="stat-number">400+</div>
        </div>

        <div className="col-lg-3 stats-section">
          <h6>Specialities</h6>
          <div className="stat-number">15+</div>
        </div>

        <div className="col-lg-3 stats-section">
          <h6>Strong Clinical Team</h6>
          <div className="stat-number">50+</div>
        </div>
      </div>

      <div className="container my-5">
        <div className="second-opinion-section">
          <div className="second-opinion-content">
            <h3 className="second-opinion-title">Looking for a Second Opinion?</h3>
            <h2 className="second-opinion-highlight">
              Contact Us for a Free Second Opinion!
            </h2>
            <p className="mt-3">
              At [Hospital Name], we understand that making informed decisions
              about your health can be challenging. Whether you’re facing a new
              diagnosis, considering treatment options, or just need reassurance
              about your current care plan, we’re here to help. Our experienced
              team of specialists offers comprehensive evaluations to ensure you
              feel confident in your healthcare choices.
            </p>
            <a href="#" className="second-opinion-btn mt-3">
              <span>➔</span> Get Your Free Second Opinion
            </a>
          </div>
          <div>
            <img
              src={
                "https://res.cloudinary.com/sdk28cdn/image/upload/v1756301087/agastya/free-second-opinion-doctor-portrait.png"
              }
              alt="Doctor"
              className="doctor-img"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
