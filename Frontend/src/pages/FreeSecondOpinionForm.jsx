import React, { useState } from "react";

const initialState = {
  fullName: "",
  email: "",
  mobileNumber: "",
  message: "",
  agreePolicy: false,
  isWhatsApp: false,
};

const FreeSecondOpinionForm = () => {
  const [formState, setFormState] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formState.fullName) newErrors.name = "Name is required";
    if (!formState.email) newErrors.email = "Email is required";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email))
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
    <div className="container p-5">
      <div className="row">
        <div className="col-lg-5">
          {/* <p className="mb-6">
            Fill out the form below and our specialists will review your case
            and get back to you as soon as possible.
          </p> */}
          {submitted ? (
            <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
              Thank you for submitting your request! Our team will contact you
              soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="booking-form-container">
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
                <label className="f-14" htmlFor="isWhatsApp">
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
                <label className="f-14" htmlFor="agreePolicy">
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
          )}
        </div>

        <div className="col-lg-7">
          <h2 className="paragraph-28 f-w-900 my-4">
            Why should you get a second opinion?
          </h2>
          <p className="mb-4">
            Obtaining a second opinion is crucial for confirming an accurate
            diagnosis and exploring the best treatment options. A good
            consultant will appreciate the perspective of another professional.
          </p>

          <p>
            When seeking a second opinion, it's important to provide the precise
            details of your diagnosis and the proposed treatment plan to the
            evaluating physician. Always ensure you have the following
            information and reports on hand:
          </p>

          <ul className="list-item-brandicon">
            <li>Copies of all your pathology findings and reports</li>
            <li>
              If you have had surgery earlier, a copy of the postoperative
              report
            </li>
            <li>If you were hospitalized earlier, the discharge summary</li>
            <li>A summary of your current treatment plan.</li>
            <li>Details of your current medication plan and dosage schedule</li>
          </ul>

          <p className="f-14 text-danger">
            The free second opinion service is available exclusively for online
            inquiries.
            <br />
            Please complete the form to continue.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FreeSecondOpinionForm;
