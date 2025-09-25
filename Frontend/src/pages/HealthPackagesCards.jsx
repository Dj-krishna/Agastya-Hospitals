import React, { useState, useEffect } from "react";
import ModalComponent from "../components/common/ModalComponent";
import { useDispatch, useSelector } from "react-redux";
import { fetchHealthPackages } from "../slices/healthPackages";

const HealthPackagesCards = () => {
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [packageData, setPackageData] = useState({});
  const [formState, setFormState] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
  });
  const dispatch = useDispatch();
  const {
    healthPackages: packages,
    loading,
    error,
  } = useSelector((state) => state);

  useEffect(() => {
    dispatch(fetchHealthPackages());
  }, [dispatch]);

  function getOriginalPrice(packageData) {
    let originalPrice = 0;
    if (packageData.discountType === "Fixed") {
      originalPrice = packageData.price + packageData.discountAmount;
    } else {
      originalPrice =
        packageData.price / (1 - packageData.discountAmount / 100);
    }
    return originalPrice.toFixed(2); // round to 2 decimals
  }

  function getDiscountPercentage(packageData) {
    if (packageData.discountType === "Fixed") {
      const originalPrice = packageData.price + packageData.discountAmount;
      const discountPercent =
        (packageData.discountAmount / originalPrice) * 100;
      return discountPercent.toFixed(2);
    } else {
      return packageData.discountAmount;
    }
  }

  const openBookNow = (data) => {
    setPackageData(data);
    setIsBookOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const isFormInvalid = () => {
    const requiredFields = ["fullName", "mobileNumber", "email"];
    return requiredFields.some(
      (field) =>
        formState[field] === null ||
        formState[field] === undefined ||
        formState[field] === "" ||
        (typeof formState[field] === "boolean" && formState[field] === false)
    );
  };
  return (
    <>
      <div class="row g-4 m-0">
        {packages.packages?.map((pkg) => (
          <div className="col-md-3">
            <div className="package-card shadow-md border-1">
              <span className="discount-badge">
                {getDiscountPercentage(pkg)}% Off
              </span>
              <h5 className="packagename">{pkg.packageName}</h5>
              <p className="tests-covered">Tests Covered: 24</p>
              <ul
                className="tests-list"
                style={{
                  height: "100px",
                  overflowY: "scroll",
                  listStylePosition: "outside",
                  paddingLeft: "20px",
                }}
              >
                {pkg.coveredTests.map((test, idx) => (
                  <li key={idx}>{test}</li>
                ))}
              </ul>
              <div className="price-container">
                <span className="price">
                  INR {pkg.price.toLocaleString("en-IN")}/-
                </span>
                <span className="old-price">INR {getOriginalPrice(pkg)}/-</span>
              </div>
              <button
                className="packagebook-btn mt-3"
                onClick={() => openBookNow(pkg)}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
      <ModalComponent
        isOpen={isBookOpen}
        onHide={() => setIsBookOpen(false)}
        data={packageData}
        mtitle={"Book Health Package"}
        children={
          <form>
            <div className="row m-0">
              <div className="booking-form-group my-0">
                <label for="fullName" className="booking-form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="booking-form-input"
                  value={formState.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>
            </div>
            <div className="row m-0">
              <div className="booking-form-group my-0">
                <label for="mobileNumber" className="booking-form-label">
                  Mobile Number
                </label>
                <input
                  type="text"
                  id="mobileNumber"
                  name="mobileNumber"
                  className="booking-form-input"
                  value={formState.mobileNumber}
                  onChange={handleChange}
                  placeholder="Enter your mobile number"
                />
              </div>
            </div>
            <div className="row m-0">
              <div className="booking-form-group my-0">
                <label for="email" className="booking-form-label">
                  Email Address
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  className="booking-form-input"
                  value={formState.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                />
              </div>
            </div>
            <div className="row m-0">
              <div className="col-md-12 text-center">
                <button
                  type="submit"
                  className={`btn ${
                    isFormInvalid() ? "btn-secondary" : "btn-primary"
                  }`}
                  disabled={isFormInvalid()}
                >
                  Submit
                </button>
                &nbsp;&nbsp;
                <button
                  type="button"
                  className="btn btn-danger py-2"
                  onClick={() => {
                    setFormState({ fullName: "", email: "", mobileNumber: "" });
                    setIsBookOpen(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        }
      />
    </>
  );
};

export default HealthPackagesCards;
