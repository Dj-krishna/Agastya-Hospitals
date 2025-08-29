import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Terms & Conditions</h2>
      <p className="mb-4">
        Welcome to Agastya Hospitals. By accessing or using our website and
        services, you agree to comply with and be bound by the following terms
        and conditions.
      </p>
      <h3 className="text-xl font-semibold mt-6 mb-2">Use of Services</h3>
      <ul className="list-disc ml-6 mb-4">
        <li>
          Our services are intended for personal and non-commercial use only.
        </li>
        <li>
          You agree to provide accurate and complete information when using our
          services.
        </li>
        <li>
          Unauthorized use of our website or services is strictly prohibited.
        </li>
      </ul>
      <h3 className="text-xl font-semibold mt-6 mb-2">Medical Disclaimer</h3>
      <p className="mb-4">
        The information provided on this website is for general informational
        purposes only and should not be considered medical advice. Always
        consult a qualified healthcare provider for medical concerns.
      </p>
      <h3 className="text-xl font-semibold mt-6 mb-2">
        Limitation of Liability
      </h3>
      <p className="mb-4">
        Agastya Hospitals is not liable for any direct, indirect, incidental, or
        consequential damages arising from the use of our website or services.
      </p>
      <h3 className="text-xl font-semibold mt-6 mb-2">Changes to Terms</h3>
      <p className="mb-4">
        We reserve the right to update or modify these terms at any time.
        Changes will be posted on this page, and your continued use of our
        services constitutes acceptance of those changes.
      </p>
      <p className="mt-6">
        If you have any questions about these terms, please contact us at{" "}
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

export default TermsAndConditions;
