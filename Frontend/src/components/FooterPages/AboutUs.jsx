import React from "react";

const AboutUs = () => {
  return (
    <div className="container py-8">
      <h2 className="text-2xl font-bold mb-4">About Agastya Hospitals</h2>
      <p>
        Agastya Hospitals is committed to providing world-class healthcare
        services with compassion and excellence. Our team of experienced
        doctors, nurses, and staff work together to ensure every patient
        receives personalized care.
      </p>
      <h3 className="text-xl font-semibold mt-6 mb-2">Our Mission</h3>
      <p>
        To deliver high-quality, affordable healthcare to all sections of
        society, using the latest technology and best medical practices.
      </p>
      <h3 className="text-xl font-semibold mt-6 mb-2">Why Choose Us?</h3>
      <ul className="list-disc ml-6">
        <li>24x7 Emergency and Trauma Care</li>
        <li>Highly qualified and experienced medical professionals</li>
        <li>State-of-the-art infrastructure and equipment</li>
        <li>Patient-centric approach</li>
        <li>Comprehensive range of specialties</li>
      </ul>
      <p className="mt-6">
        At Agastya Hospitals, your health and well-being are our top priorities.
        Thank you for trusting us with your care.
      </p>
    </div>
  );
};

export default AboutUs;
