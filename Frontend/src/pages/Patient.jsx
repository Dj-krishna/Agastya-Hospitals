// const Patient = () => {
//   return (
//     <div className="py-16">
//       <div className="container mx-auto px-4">
//         <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
//           Patient Portal
//         </h1>

import { useState } from "react";

//         <div className="max-w-4xl mx-auto">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {/* Login Form */}
//             <div className="bg-white p-8 rounded-lg shadow-lg">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-6">
//                 Patient Login
//               </h2>

//               <form className="space-y-4">
//                 <div>
//                   <label className="block text-gray-700 mb-2">Patient ID</label>
//                   <input
//                     type="text"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hospital-blue"
//                     placeholder="Enter your Patient ID"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 mb-2">Password</label>
//                   <input
//                     type="password"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-hospital-blue"
//                     placeholder="Enter your password"
//                   />
//                 </div>

//                 <button className="w-full btn-primary">
//                   Login
//                 </button>
//               </form>

//               <div className="mt-6 text-center">
//                 <a href="#" className="text-hospital-blue hover:text-hospital-dark-blue">
//                   Forgot Password?
//                 </a>
//               </div>
//             </div>

//             {/* Registration */}
//             <div className="bg-white p-8 rounded-lg shadow-lg">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-6">
//                 New Patient Registration
//               </h2>

//               <p className="text-gray-600 mb-6">
//                 Register as a new patient to access our online services and manage your healthcare journey.
//               </p>

//               <button className="w-full btn-secondary">
//                 Register Now
//               </button>

//               <div className="mt-6 space-y-4">
//                 <h3 className="font-semibold text-gray-900">Patient Services:</h3>
//                 <ul className="space-y-2 text-gray-600">
//                   <li>• Book appointments online</li>
//                   <li>• View medical records</li>
//                   <li>• Access test results</li>
//                   <li>• Manage prescriptions</li>
//                   <li>• Pay bills online</li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Patient

const Patient = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const isFormInvalid = (formState) => {
    const requiredFields = ["userName", "password"];
    return requiredFields.some(
      (field) =>
        formState[field] === null ||
        formState[field] === undefined ||
        formState[field] === "" ||
        (typeof formState[field] === "boolean" && formState[field] === false)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    
  }

  return (
    <div className="py-5">
      <div className="container px-3 patient-login">
        {/* <h1 className="h1 fw-bold text-dark text-center mb-5">
          Patient Portal
        </h1> */}

        <div className="mx-auto" style={{ maxWidth: "960px" }}>
          {/* max-w-4xl */}
          <div className="row g-4">
            {/* Login Form */}
            <div className="col-12 col-md-6">
              <div className="bg-white p-4 rounded shadow">
                <h2 className="h4 fw-semibold text-dark mb-4">Patient Login</h2>

                <form className="d-grid gap-3" onSubmit={handleSubmit}>
                  <div>
                    <label className="form-label text-dark">Patient ID</label>
                    <input
                      type="text"
                      className="booking-form-input"
                      placeholder="Enter your Patient ID"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="form-label text-dark">Password</label>
                    <input
                      type="password"
                      className="booking-form-input"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary rounded-5"
                    disabled={isFormInvalid({ userName, password })}
                  >
                    Login
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <a href="#" className="text-primary text-decoration-none">
                    Forgot Password?
                  </a>
                </div>
              </div>
            </div>

            {/* Registration */}
            <div className="col-12 col-md-6">
              <div className="bg-white p-4 rounded shadow">
                <h2 className="h4 fw-semibold text-dark mb-4">
                  New Patient Registration
                </h2>

                <p className="text-muted mb-4">
                  Register as a new patient to access our online services and
                  manage your healthcare journey.
                </p>

                <button className="btn btn-secondary w-100 mb-4">
                  Register Now
                </button>

                <div>
                  <h3 className="fw-semibold text-dark">Patient Services:</h3>
                  <ul className="list-unstyled text-muted mt-3">
                    <li>• Book appointments online</li>
                    <li>• View medical records</li>
                    <li>• Access test results</li>
                    <li>• Manage prescriptions</li>
                    <li>• Pay bills online</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patient;
