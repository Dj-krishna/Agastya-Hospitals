import React from "react";

const PatientCare = () => {
  return (
    <div className="container p-5">
      <h2 className="text-2xl font-bold mb-4">
        Patient Care at Agastya Hospitals
      </h2>
      <p>
        At Agastya Hospitals, we are dedicated to providing exceptional patient
        care through a holistic and compassionate approach. Our team ensures
        that every patient receives personalized attention and support
        throughout their healthcare journey.
      </p>
      <h3 className="text-xl font-semibold mt-6 mb-2">
        Our Patient Care Services
      </h3>
      <ul className="list-disc ml-6">
        <li>24x7 Nursing and Medical Support</li>
        <li>Patient Counseling and Education</li>
        <li>Comprehensive Inpatient and Outpatient Services</li>
        <li>Specialized Care for Elderly and Children</li>
        <li>Assistance with Appointments and Follow-ups</li>
      </ul>
      <p className="mt-6">
        We believe in treating every patient with dignity, respect, and empathy.
        Our staff is always available to address your concerns and ensure your
        comfort and well-being.
      </p>
    </div>
  );
};

export default PatientCare;
