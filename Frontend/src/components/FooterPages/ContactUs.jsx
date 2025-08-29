import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const ContactUs = () => {
  return (
    <div className="container py-12 px-4 mx-auto max-w-3xl bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-extrabold mb-6 text-hospital-blue text-center">Contact Us</h2>
      <p className="text-gray-700 mb-8 text-center">
        We are here to help you with any questions or concerns. Please feel free
        to reach out to us using the information below.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Address */}
        <div className="flex flex-col items-center text-center">
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <FaMapMarkerAlt className="text-hospital-blue text-2xl" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Hospital Address</h3>
          <p className="text-gray-600">
            Agastya Hospitals<br />
            123 Health Avenue,<br />
            Hyderabad, Telangana 500001<br />
            India
          </p>
        </div>
        {/* Phone & Email */}
        <div className="flex flex-col items-center text-center">
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <FaPhoneAlt className="text-hospital-blue text-2xl" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Phone</h3>
          <p className="text-gray-600">
            24x7 Helpline:{" "}
            <a href="tel:04065108108" className="text-blue-600 font-medium hover:underline">
              040 65 108 108
            </a>
            <br />
            Mobile:{" "}
            <a href="tel:+919459108108" className="text-blue-600 font-medium hover:underline">
              +91 9459 108 108
            </a>
          </p>
          <div className="bg-blue-100 p-4 rounded-full mb-4 mt-6">
            <FaEnvelope className="text-hospital-blue text-2xl" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Email</h3>
          <p>
            <a
              href="mailto:info@agastyahospitals.com"
              className="text-blue-600 font-medium hover:underline"
            >
              info@agastyahospitals.com
            </a>
          </p>
        </div>
      </div>
      {/* Social Links */}
      <div className="mt-10 flex flex-col items-center">
        <h3 className="text-xl font-semibold mb-3">Follow Us</h3>
        <div className="flex space-x-6">
          <a
            href="https://facebook.com/agastyahospitals"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-2xl"
            aria-label="Facebook"
          >
            <FaFacebook />
          </a>
          <a
            href="https://twitter.com/agastyahosp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-600 text-2xl"
            aria-label="Twitter"
          >
            <FaTwitter />
          </a>
          <a
            href="https://instagram.com/agastyahospitals"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-500 hover:text-pink-700 text-2xl"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;