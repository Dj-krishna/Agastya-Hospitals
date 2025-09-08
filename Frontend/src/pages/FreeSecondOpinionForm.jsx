import React, { useState } from "react";

const initialState = {
  name: "",
  email: "",
  phone: "",
  message: "",
  reports: null,
};

const FreeSecondOpinionForm = () => {
  const [form, setForm] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email.trim())
    )
      newErrors.email = "Enter a valid email address";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(form.phone.trim()))
      newErrors.phone = "Enter a valid 10-digit phone number";
    if (!form.message.trim()) newErrors.message = "Please describe your case";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
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

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-lg-6 mx-auto">
          <p className="mb-6">
            Fill out the form below and our specialists will review your case
            and get back to you as soon as possible.
          </p>
          {submitted ? (
            <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
              Thank you for submitting your request! Our team will contact you
              soon.
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-5 bg-white p-6 rounded shadow"
            >
              <div>
                <label className="block font-medium mb-1" htmlFor="name">
                  Full Name
                </label>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <span className="text-red-600 text-xs">{errors.name}</span>
                )}
              </div>
              <div>
                <label className="block font-medium mb-1" htmlFor="email">
                  Email
                </label>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <span className="text-red-600 text-xs">{errors.email}</span>
                )}
              </div>
              <div>
                <label className="block font-medium mb-1" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  type="text"
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
                {errors.phone && (
                  <span className="text-red-600 text-xs">{errors.phone}</span>
                )}
              </div>
              <div>
                <label className="block font-medium mb-1" htmlFor="message">
                  Describe Your Case
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  id="message"
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                />
                {errors.message && (
                  <span className="text-red-600 text-xs">{errors.message}</span>
                )}
              </div>
              <div>
                <label className="block font-medium mb-1" htmlFor="reports">
                  Upload Medical Reports (optional)
                </label>
                <input
                  className="w-full"
                  type="file"
                  id="reports"
                  name="reports"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="primary-btn">
                Submit Request
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreeSecondOpinionForm;
