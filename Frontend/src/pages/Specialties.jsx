import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSpecialties } from "../slices/specialtySlice";


const Specialties = () => {
  const dispatch = useDispatch();
  const { specialties, loading: isLoading } = useSelector(
    (state) => state.specialties
  );

  useEffect(() => {
    dispatch(fetchSpecialties());
  }, [dispatch]);

  return (
    <div>
    <div className="container py-5">
      {isLoading ? (
        <div className="text-center py-5">
          <div
            className="spinner-border text-primary"
            style={{ width: "3rem", height: "3rem" }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading specialties...</p>
        </div>
      ) : (
        <div className="row">

          <div className="col-lg-12 text-center mb-12">
            <h2 className="main-title-center">Explore Our Specialties</h2>
          </div>

          
 
          {specialties.data?.length > 0 ? (
            specialties.data.map((specialty) => (
              <div key={specialty._id} className="col-lg-3">
                {/* <div className=""> */}
                  <div className="specialtypage-card">
                    
                    <div className="mb-3">
                      {specialty.icon ||
                      (specialty.banner && specialty.banner.length > 0) ? (
                        <img
                          src={specialty.icon || specialty.banner[0]}
                          alt={specialty.specialityName}
                          className="specialtypage-icon"
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: "cover",
                            background: "#f5f5f5",
                          }}
                        />
                      ) : (
                        <svg
                          className="bd-placeholder-img rounded-circle"
                          width="50"
                          height="50"
                          xmlns="http://www.w3.org/2000/svg"
                          role="img"
                          aria-label="Specialty icon"
                          preserveAspectRatio="xMidYMid slice"
                          focusable="false"
                        >
                          <rect
                            width="100%"
                            height="100%"
                            fill="#e3e6ea"
                          ></rect>
                          <text
                            x="50%"
                            y="55%"
                            textAnchor="middle"
                            fill="#adb5bd"
                            fontSize="18"
                          >
                            <tspan>:)</tspan>
                          </text>
                        </svg>
                      )}
                    </div>
                    <h5 className="specialtypage-name">
                      {specialty.specialityName}
                    </h5>
                    <p
                      className="specialtypage-desc"
                      style={{ minHeight: 40 }}
                    >
                      {specialty.shortDescription}
                    </p>
                    {/* <div className="mb-2 text-center small text-secondary">
                      <strong>Doctor:</strong>
                      <p className="text-center">
                        {specialty.doctorName ? specialty.doctorName : "---"}
                      </p>
                    </div> */}
                    <div className="specialtypage-btn">
                      <a href="#">Know More</a>
                      {/* <span
                        className={`badge ${
                          specialty.isActive ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {specialty.isActive ? "Active" : "Inactive"}
                      </span> */}
                      
                    </div>
                  </div>
                  
                {/* </div> */}
              </div>
            ))
          ) : (
            <div className="text-center text-muted py-5">
              No Specialties available...
            </div>
          )}
        </div>
      )}
    </div>



      <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="main-title-center mb-12">FAQs</h2>
            </div>
          </div>        
      </section>

       </div>
  );
};

export default Specialties;
