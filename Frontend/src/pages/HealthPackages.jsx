import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHealthPackages } from "../slices/healthPackages";
import { useState } from "react";
import ModalComponent from "../components/common/ModalComponent";
import HealthPackagesCards from "./HealthPackagesCards";

const HealthPackages = () => {
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
    <div className="container py-5">
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
      <HealthPackagesCards />
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
