import React, { useState } from "react";

const initialState = {
  fullName: "",
  email: "",
  mobileNumber: "",
  message: "",
  agreePolicy: false,
  isWhatsApp: false,
};

const EnquiryForm = () => {
  const [formState, setFormState] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formState.fullName) newErrors.name = "Name is required";
    if (!formState.email) newErrors.email = "Email is required";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formState.email))
      newErrors.email = "Enter a valid email address";
    if (!formState.mobileNumber)
      newErrors.mobileNumber = "Mobile number is required";
    else if (!/^\d{10}$/.test(formState.mobileNumber))
      newErrors.mobileNumber = "Enter a valid 10-digit phone number";
    if (!formState.message) newErrors.message = "Please describe your case";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true);
      // Here you would send the form data to your backend
    }
  };

  const isFormInvalid = () => {
    const requiredFields = ["fullName", "mobileNumber", "email", "agreePolicy"];
    return requiredFields.some(
      (field) =>
        formState[field] === null ||
        formState[field] === undefined ||
        formState[field] === "" ||
        (typeof formState[field] === "boolean" && formState[field] === false)
    );
  };
  return (
    <form onSubmit={handleSubmit} className="booking-form-container bg-light border-none">
      <div className="booking-form-group">
        <h2 className="booking-form-title">Enquire Now</h2>
        <label className="booking-form-label" htmlFor="fullName">
          Full Name
        </label>
        <input
          className="booking-form-input"
          type="text"
          id="fullName"
          name="fullName"
          value={formState.fullName}
          placeholder="Enter full name"
          onChange={handleChange}
        />
      </div>
      <div className="booking-form-group">
        <label className="booking-form-label" htmlFor="mobileNumber">
          Mobile Number
        </label>
        <input
          className="booking-form-input"
          type="text"
          id="mobileNumber"
          name="mobileNumber"
          value={formState.mobileNumber}
          placeholder="Enter phone number"
          onChange={handleChange}
          maxLength={10}
        />
      </div>
      <div className="booking-form-group">
        <input
          id="isWhatsApp"
          type="checkbox"
          checked={formState.isWhatsApp}
          onChange={() =>
            setFormState({
              ...formState,
              isWhatsApp: !formState.isWhatsApp,
            })
          }
        />{" "}
        <label className="f-12" htmlFor="isWhatsApp">
          This is my WhatsApp number
        </label>
      </div>
      <div className="booking-form-group">
        <label className="booking-form-label" htmlFor="email">
          Email
        </label>
        <input
          className="booking-form-input"
          type="email"
          id="email"
          name="email"
          value={formState.email}
          placeholder="Enter email address"
          onChange={handleChange}
        />
      </div>
      <div className="booking-form-group">
        <label className="booking-form-label" htmlFor="message">
          Message
        </label>
        <textarea
          className="booking-form-textarea"
          id="message"
          name="message"
          rows={4}
          value={formState.message}
          placeholder="Enter your query"
          onChange={handleChange}
        />
        {errors.message && (
          <span className="text-red-600 text-xs">{errors.message}</span>
        )}
      </div>
      <div className="booking-form-group mb-3">
        <input
          id="agreePolicy"
          type="checkbox"
          checked={formState.agreePolicy}
          onChange={() =>
            setFormState({
              ...formState,
              agreePolicy: !formState.agreePolicy,
            })
          }
        />{" "}
        <label className="f-12" htmlFor="agreePolicy">
          I agree to the Terms & Conditions and Privacy Policy.
        </label>
      </div>
      <button
        type="submit"
        className={`rounded-5 btn ${
          isFormInvalid() ? "btn-secondary" : "btn-primary"
        }`}
        disabled={isFormInvalid()}
      >
        Submit Request
      </button>
    </form>
  );
};

export default EnquiryForm;
