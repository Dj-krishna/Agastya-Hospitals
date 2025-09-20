// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchHealthPackages } from "../slices/healthPackages";

// const getDiscountedPrice = (pkg) => {
//   if (pkg.discountType === "Fixed") {
//     return pkg.price - pkg.discountAmount;
//   }
//   if (pkg.discountType === "Percentage") {
//     return Math.round(pkg.price * (1 - pkg.discountAmount / 100));
//   }
//   return pkg.price;
// };

// const HealthPackages = () => {
//   const dispatch = useDispatch();
//   const {
//     healthPackages: packages,
//     loading,
//     error,
//   } = useSelector((state) => state);

//   useEffect(() => {
//     dispatch(fetchHealthPackages());
//   }, [dispatch]);

//   return (
//     <div className="container py-5 px-5">
//       <h1 className="display-5 fw-bold text-center mb-5">
//         Explore the Health Packages
//       </h1>

//       {loading && (
//         <div className="text-center py-5">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading health packages...</span>
//           </div>
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-danger text-center" role="alert">
//           Failed to load health packages.
//         </div>
//       )}

//       <div className="row g-4 mx-5">
//         {packages.packages?.map((pkg) => (
//           <div className="col-12 col-md-6 col-lg-4" key={pkg._id}>
//             <div className="card h-100 shadow-sm border-1 p-3 rounded-4">
//               <img
//                 src={pkg.photo}
//                 alt={pkg.packageName}
//                 className="card-img-top rounded-2"
//                 style={{ height: 200, objectFit: "cover" }}
//               />
//               <div className="card-body d-flex flex-column">
//                 <h5 className="card-title fw-bold">{pkg.packageName}</h5>
//                 <div className="mb-2">
//                   <span className="fs-4 fw-bold text-primary">
//                     ₹{getDiscountedPrice(pkg)}
//                   </span>
//                   <span className="text-muted text-decoration-line-through ms-2">
//                     ₹{pkg.price}
//                   </span>
//                   <span className="badge bg-success ms-2">
//                     {pkg.discountType === "Fixed"
//                       ? `₹${pkg.discountAmount} OFF`
//                       : `${pkg.discountAmount}% OFF`}
//                   </span>
//                 </div>
//                 <div className="mb-1 small">
//                   <strong>Total Lab Tests:</strong> {pkg.totalLabTests}
//                 </div>
//                 <div className="mb-1 small">
//                   <strong>Ideal For:</strong> {pkg.idealFor} &nbsp;|&nbsp;
//                   <strong>Age Group:</strong> {pkg.ageGroup}
//                 </div>
//                 <div className="mb-1 small">
//                   <strong>Description:</strong> {pkg.description}
//                 </div>
//                 <div className="mb-1 small">
//                   <strong>Guidelines:</strong> {pkg.guidelines}
//                 </div>
//                 <div className="mb-2">
//                   <strong className="small">Covered Tests:</strong>
//                   <ul
//                     className="small ps-3 mb-0"
//                     style={{ maxHeight: 80, overflowY: "auto" }}
//                   >
//                     {pkg.coveredTests.map((test, idx) => (
//                       <li key={idx}>{test}</li>
//                     ))}
//                   </ul>
//                 </div>
//                 {/* <div className="mt-auto">
//                   <button className="btn btn-primary w-100">Book Now</button>
//                 </div> */}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="text-center pt-4 mt-5">
//         <p className="mb-2">
//           Need a custom package? Contact us for personalized health check-up
//           plans.
//         </p>
//         <button className="btn btn-outline-primary">Contact Us</button>
//       </div>
//     </div>
//   );
// };

// export default HealthPackages;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHealthPackages } from "../slices/healthPackages";

const HealthPackages = () => {
  const dispatch = useDispatch();
  const {
    healthPackages: packages,
    loading,
    error,
  } = useSelector((state) => state);

  useEffect(() => {
    dispatch(fetchHealthPackages());
  }, [dispatch]);

  return (
    <div className="container py-5">
      <h1 className="display-5 fw-bold text-center mb-5">
        Explore the Health Packages
      </h1>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading health packages...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          Failed to load health packages.
        </div>
      )}

      <div className="row g-4 justify-content-center mx-5">
        {packages.packages?.map((pkg) => (
          <div className="col-12 col-md-6 col-lg-4" key={pkg._id}>
            <div
              className="card h-100 shadow-sm border-1 rounded-4 p-4"
              style={{ minHeight: 480 }}
            >
              <div className="card-body d-flex flex-column">
                <h4 className="fw-bold mb-4">{pkg.packageName}</h4>
                {pkg.coveredTests.length > 0 && (
                  <p className="mb-2 f-w-600">Tests covered</p>
                )}
                <ul className="list-unstyled mb-4">
                  {pkg.coveredTests.map((test, idx) => (
                    <li key={idx} className="mb-2 d-flex align-items-center">
                      <span
                        className="text-success me-2"
                        style={{ fontSize: "1.2rem" }}
                      >
                        &#10003;
                      </span>
                      <span className="f-16">{test}</span>
                    </li>
                  ))}
                </ul>
                <hr className="" />
                <div className="">
                  <span
                    className="fw-bold"
                    style={{ color: "#2046ae", fontSize: "2rem" }}
                  >
                    INR {pkg.price.toLocaleString("en-IN")}/-
                  </span>
                </div>
                {/* <button className="btn btn-primary fw-bold px-4 py-2" style={{ background: "#002952", border: "none" }}>
                  Book Now
                </button> */}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-4 mt-5">
        <p className="mb-2">
          Need a custom package? Contact us for personalized health check-up
          plans.
        </p>
        <button className="btn btn-outline-primary">Contact Us</button>
      </div>
    </div>
  );
};

export default HealthPackages;
