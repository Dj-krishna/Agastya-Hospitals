import React from "react";

const NewsAndUpdates = () => {
  return (
    <div className="container py-8">
      <h2 className="text-2xl font-bold mb-4">News & Updates</h2>
      <ul className="list-disc ml-6">
        <li>
          <strong>June 2025:</strong> Agastya Hospitals launches a new
          Cardiology Wing equipped with state-of-the-art technology.
        </li>
        <li>
          <strong>May 2025:</strong> Free health check-up camp organized for
          senior citizens. Over 500 people benefited.
        </li>
        <li>
          <strong>April 2025:</strong> Dr. Priya Sharma awarded "Best
          Pediatrician of the Year" by the City Medical Association.
        </li>
        <li>
          <strong>March 2025:</strong> COVID-19 vaccination drive successfully
          completed for all hospital staff.
        </li>
        <li>
          <strong>February 2025:</strong> Agastya Hospitals partners with ABC
          Labs for advanced diagnostic services.
        </li>
      </ul>
      <p className="mt-6">
        Stay tuned for more updates and events from Agastya Hospitals!
      </p>
    </div>
  );
};

export default NewsAndUpdates;
