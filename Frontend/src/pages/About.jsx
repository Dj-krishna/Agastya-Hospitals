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
            <img src={"https://placehold.co/800x400/EEE/31343C"} />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto aboutus-text">
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

      {/* stats-card d-flex justify-content-between align-items-center flex-wrap gap-0 */}

      <div class="row stats-container">
        <div class="col-lg-3 stats-section">
          <h6>Happy Patients</h6>
          <div class="stat-number">10,000+</div>
        </div>

        <div class="col-lg-3 stats-section">
          <h6>Surgeries Performed</h6>
          <div class="stat-number">400+</div>
        </div>

        <div class="col-lg-3 stats-section">
          <h6>Specialities</h6>
          <div class="stat-number">15+</div>
        </div>

        <div class="col-lg-3 stats-section">
          <h6>Strong Clinical Team</h6>
          <div class="stat-number">50+</div>
        </div>
      </div>

      <div class="container my-5">
        <div class="second-opinion-section">
          <div class="second-opinion-content">
            <h3 class="second-opinion-title">Looking for a Second Opinion?</h3>
            <h2 class="second-opinion-highlight">
              Contact Us for a Free Second Opinion!
            </h2>
            <p class="mt-3">
              At [Hospital Name], we understand that making informed decisions
              about your health can be challenging. Whether you’re facing a new
              diagnosis, considering treatment options, or just need reassurance
              about your current care plan, we’re here to help. Our experienced
              team of specialists offers comprehensive evaluations to ensure you
              feel confident in your healthcare choices.
            </p>
            <a href="#" class="second-opinion-btn mt-3">
              <span>➔</span> Get Your Free Second Opinion
            </a>
          </div>
          <div>
            <img
              src={
                "https://res.cloudinary.com/sdk28cdn/image/upload/v1756301087/agastya/free-second-opinion-doctor-portrait.png"
              }
              alt="Doctor"
              class="doctor-img"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
