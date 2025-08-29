import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
      <p className="mb-4">
        At Agastya Hospitals, we are committed to protecting your privacy and
        ensuring the security of your personal information. This Privacy Policy
        explains how we collect, use, and safeguard your data when you use our
        services.
      </p>
      <h3 className="text-xl font-semibold mt-6 mb-2">
        Information We Collect
      </h3>
      <ul className="list-disc ml-6 mb-4">
        <li>
          Personal identification information (Name, email address, phone
          number, etc.)
        </li>
        <li>Medical records and health information</li>
        <li>Appointment and billing details</li>
        <li>Feedback and communication data</li>
      </ul>
      <h3 className="text-xl font-semibold mt-6 mb-2">
        How We Use Your Information
      </h3>
      <ul className="list-disc ml-6 mb-4">
        <li>To provide and manage healthcare services</li>
        <li>To process appointments and billing</li>
        <li>To improve our services and patient experience</li>
        <li>To communicate important updates and information</li>
      </ul>
      <h3 className="text-xl font-semibold mt-6 mb-2">Data Security</h3>
      <p className="mb-4">
        We implement strict security measures to protect your data from
        unauthorized access, alteration, or disclosure. Your information is
        stored securely and accessed only by authorized personnel.
      </p>
      <h3 className="text-xl font-semibold mt-6 mb-2">Your Rights</h3>
      <ul className="list-disc ml-6 mb-4">
        <li>You can request access to your personal data</li>
        <li>You can ask for corrections or updates to your information</li>
        <li>
          You may request deletion of your data, subject to legal requirements
        </li>
      </ul>
      <p className="mt-6">
        If you have any questions about our privacy practices, please contact us
        at{" "}
        <a
          href="mailto:info@agastyahospitals.com"
          className="text-blue-600 underline"
        >
          info@agastyahospitals.com
        </a>
        .
      </p>
    </div>
  );
};

export default PrivacyPolicy;
