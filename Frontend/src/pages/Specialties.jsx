import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSpecialties } from "../slices/specialtySlice";
import { Link } from "react-router-dom";

const Specialties = () => {
  const dispatch = useDispatch();
  const { specialties, loading: isLoading } = useSelector(
    (state) => state.specialties
  );

  useEffect(() => {
    dispatch(fetchSpecialties());
  }, [dispatch]);

  return (
    <div className="container py-5 px-5">
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
        <div className="row g-4 mx-5">
          {specialties.data?.length > 0 ? (
            specialties.data.map((specialty) => (
              <div
                key={specialty._id}
                className="col-12 col-sm-6 col-md-3 col-lg-3"
              >
                <div className="card h-100 shadow border-1 rounded-4 specialty-card p-3">
                  <div className="card-body d-flex flex-column align-items-center p-0">
                    <div className="mb-3">
                      {specialty.icon ||
                      (specialty.banner && specialty.banner.length > 0) ? (
                        <img
                          src={specialty.icon || specialty.banner[0]}
                          alt={specialty.specialityName}
                          className="rounded-circle border border-2"
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
                    <h5 className="card-title fw-bold text-center mb-2 text-hospital-blue">
                      {specialty.specialityName}
                    </h5>
                    <p
                      className="text-muted text-center mb-2 f-12"
                      style={{ minHeight: 40 }}
                    >
                      {specialty.shortDescription}
                    </p>
                    <div className="mb-2 text-center small text-secondary">
                      <strong>Doctor:</strong>
                      <p className="text-center">
                        {specialty.doctorName ? specialty.doctorName : "---"}
                      </p>
                    </div>
                    <div className="mt-auto w-100 d-flex justify-content-between align-items-center">
                      <a href="#" className="f-12 text-info">
                        Learn more
                      </a>
                      <span
                        className={`badge ${
                          specialty.isActive ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {specialty.isActive ? "Active" : "Inactive"}
                      </span>
                      {/* <Link
                        to={`/specialties/${specialty.urlSlug}`}
                        className="btn book-btn f-12 rounded-4"
                      >
                        Learn More
                      </Link> */}
                    </div>
                  </div>
                  {/* <div className="card-footer bg-white border-0 text-center small text-muted">
                    <span>
                      <i className="bi bi-people me-1"></i>
                      {specialty.doctor ? specialty.doctor : "No"} Doctors
                    </span>
                  </div> */}
                </div>
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
  );
};

export default Specialties;
