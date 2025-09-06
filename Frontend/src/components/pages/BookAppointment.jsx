import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "../../slices/doctorsSlice";
import axios from "axios";
import {
  APPOINTMENTS_API,
  PATIENT_VERIFY_API,
  SLOTS_API,
} from "../../api/services";
import { countryCodes } from "../../api/countryCode";
import { useRef } from "react";
import { toasterConfig } from "../../utils";

const initialState = {
  fullName: "",
  mobile: "",
  email: "",
  whatsapp: false,
  doctorID: "",
  appointmentDate: new Date(),
  startTime: "",
  terms: false,
  consent: false,
  patientID: "",
  countryCode: "+91",
};
const initialStateErrors = {
  fullName: "",
  mobile: "",
  email: "",
  whatsapp: "",
  doctorID: "",
  appointmentDate: "",
  startTime: "",
  terms: "",
  consent: "",
  patientID: "",
};
const BookAppointment = () => {
  const [formState, setFormState] = useState(initialState);
  const [formErrors, setFormErrors] = useState(initialStateErrors);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [patientExists, setPatientExists] = React.useState(null);
  const [verifiedPatient, setVerifiedPatient] = React.useState(null);
  const [isCheckingSlot, setIsCheckingSlot] = React.useState(false);
  const [availableSlots, setAvailableSlots] = React.useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = React.useState(false);

  const dispatch = useDispatch();
  const dateInputRef = useRef(null);
  const { data: doctors } = useSelector((state) => state.doctors);

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      setFormState(initialState);
      setFormErrors(initialStateErrors);
      setIsSubmitted(false);
      setIsSubmitting(false);
      setIsVerifying(false);
      setPatientExists(null);
      setVerifiedPatient(null);
      setAvailableSlots([]);
    };
  }, []);

  useEffect(() => {
    if (formState.doctorID && formState.appointmentDate) {
      fetchAvailableSlots();
    } else {
      setAvailableSlots([]);
      setFormState((prev) => ({ ...prev, startTime: "" }));
      setFormErrors((prev) => ({ ...prev, startTime: "" }));
    }
  }, [formState.doctorID, formState.appointmentDate]);

  const fetchAvailableSlots = async () => {
    if (!formState.doctorID || !formState.appointmentDate) return;

    setIsLoadingSlots(true);
    try {
      const formattedDate = formState.appointmentDate;
      const response = await axios.get(
        `${SLOTS_API}/available?doctorID=${formState.doctorID}&date=${formattedDate}`
      );

      // Check if the response contains an error message
      if (response.data && response.data.error) {
        setAvailableSlots([]);
        toasterConfig("error",response.data.error);
        return;
      }

      if (
        response.data &&
        response.data.available &&
        response.data.available.length > 0
      ) {
        const slots = response.data.available[0];
        const allSlots = [
          ...(slots.morningSlot || []),
          ...(slots.eveningSlot || []),
        ];
        setAvailableSlots(allSlots);
      } else {
        setAvailableSlots([]);
        toasterConfig.warning("No available slots for the selected date and doctor.");
      }
    } catch (error) {
      console.error("Error fetching available slots:", error);
      setAvailableSlots([]);
      toasterConfig("error","Failed to fetch available slots. Please try again.");
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const verifyMobileNumber = async (mobile) => {
    if (!mobile || mobile.length !== 10) return;

    setIsVerifying(true);
    try {
      const response = await axios.post(PATIENT_VERIFY_API, { mobile });
      const { flag, patient } = response.data;

      setPatientExists(flag === 1);
      if (flag === 1 && patient) {
        setVerifiedPatient(patient);
        // Auto-fill existing patient data
        setFormState((prev) => ({
          ...prev,
          fullName: patient.fullName,
          email: patient.email,
          countryCode: patient.countryCode,
          patientID: patient.patientID,
        }));
        toasterConfig("success","Patient found! Details auto-filled.");
      } else {
        setVerifiedPatient(null);
        setFormState((prev) => ({
          ...prev,
          patientID: "",
        }));
        toasterConfig("info","New patient. Please fill in additional details.");
      }
    } catch (error) {
      console.error("Error verifying mobile:", error);
      toasterConfig("error","Error verifying mobile number");
      setPatientExists(null);
      setVerifiedPatient(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const generateEndTimeOptions = (startTime) => {
    if (!startTime) return [];

    const [hours, minutes] = startTime.split(":").map(Number);
    const startMinutes = hours * 60 + minutes;
    const endOptions = [];

    // Generate only one option: 30 minutes after start time
    const endMinutes = startMinutes + 30;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    const endTime = `${String(endHours).padStart(2, "0")}:${String(
      endMins
    ).padStart(2, "0")}`;
    endOptions.push(endTime);

    return endOptions;
  };

  const checkSlotAvailability = async () => {
    if (
      !formState.doctorID ||
      !formState.appointmentDate ||
      !formState.startTime
    ) {
      return true; // Can't check without all required fields
    }

    // Calculate end time for conflict checking
    const endTimeOptions = generateEndTimeOptions(formState.startTime);
    if (endTimeOptions.length === 0) {
      return true; // Can't check without end time
    }
    const endTime = endTimeOptions[0];

    setIsCheckingSlot(true);
    try {
      // Check if there are any existing appointments for the same doctor, date, and time
      const formattedDate = formState.appointmentDate;
      const response = await axios.get(
        `${APPOINTMENTS_API}?doctorID=${formState.doctorID}&date=${formattedDate}`
      );

      if (response.data && response.data.appointments) {
        const conflictingAppointments = response.data.appointments.filter(
          (appointment) => {
            // Check if the time slots overlap
            const existingStart = appointment.startTime;
            const existingEnd = appointment.endTime;
            const newStart = formState.startTime;
            const newEnd = endTime;

            // Check for overlap: new appointment starts before existing ends AND new appointment ends after existing starts
            return newStart < existingEnd && newEnd > existingStart;
          }
        );

        if (conflictingAppointments.length > 0) {
          toasterConfig("error",
            "This time slot conflicts with an existing appointment. Please select a different time."
          );
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Error checking slot availability:", error);
      // If we can't check, allow the submission to proceed
      return true;
    } finally {
      setIsCheckingSlot(false);
    }
  };

  const validateField = (field, value) => {
    switch (field) {
      case "fullName":
        if (!value) return "Full name is required";
        if (value.length < 3) return "Full name must be at least 3 characters";
        return "";
      case "mobile":
        if (!value) return "Mobile number is required";
        if (!/^\d{10}$/.test(value)) return "Mobile number must be 10 digits";
        return "";
      case "countryCode":
        if (!value) return "Country code is required";
        return "";
      case "email":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Invalid email format";
        return "";
      case "dob":
        if (!patientExists && !value)
          return "Date of birth is required for new patients";
        return "";
      case "gender":
        if (!patientExists && !value)
          return "Gender is required for new patients";
        return "";
      case "address":
        if (!patientExists && !value)
          return "Address is required for new patients";
        return "";
      case "appointmentDate":
        if (!value) return "Appointment date is required";
        return "";
      case "doctorID":
        if (!value) return "Doctor selection is required";
        return "";
      case "patientID":
        if (patientExists && !value) return "Patient ID is required";
        return "";
      case "startTime":
        if (!value) return "Start time is required";
        return "";

      case "termsAndConditions":
        if (value === false)
          return "You must agree to the terms and conditions";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // If mobile number is changing, reset patient-related fields
    if (name === "mobile") {
      if (value.length === 10) {
        verifyMobileNumber(value);
      } else {
        // Reset patient verification status when mobile is incomplete
        setPatientExists(null);
        setVerifiedPatient(null);
        setFormState((prev) => ({
          ...prev,
          patientID: "",
          fullName: "",
          email: "",
          dob: "",
          gender: "",
          address: "",
        }));
      }
    }

    setFormState((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (isSubmitted) {
      const errorMsg = validateField(name, value);
      setFormErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }
  };

  const handleTimeOrDateChange = () => {
    if (
      formState.doctorID &&
      formState.appointmentDate &&
      formState.startTime
    ) {
      // Debounce the check to avoid too many API calls
      setTimeout(() => {
        checkSlotAvailability();
      }, 500);
    }
  };

  const handleDateChange = (dateName, e) => {
    setFormState({ ...formState, [dateName]: e.target.value });
    if (isSubmitted) {
      const errorMsg = validateField(dateName, e.target.value);
      setFormErrors((prev) => ({ ...prev, [dateName]: errorMsg }));
    }

    // Check slot availability when appointment date changes
    if (dateName === "appointmentDate") {
      handleTimeOrDateChange();
    }
  };

  const handleStartTimeChange = (e) => {
    const startTime = e.target.value;
    setFormState((prev) => ({ ...prev, startTime }));

    if (isSubmitted) {
      const errorMsg = validateField("startTime", startTime);
      setFormErrors((prev) => ({ ...prev, startTime: errorMsg }));
    }

    // Check slot availability when start time changes
    handleTimeOrDateChange();
  };

  const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      debugger;
      const appointmentData = {
        patientName: formState.fullName,
        mobile: formState.mobile,
        doctorID: parseInt(formState.doctorID),
        patientID: patientExists ? parseInt(formState.patientID) : "",
        date: formState.appointmentDate,
        startTime: formState.startTime,
        endTime: formState.startTime
          ? generateEndTimeOptions(formState.startTime)[0] || ""
          : "",
        status: "booked",
        fullName: formState.fullName,
        email: formState.email,
        countryCode: formState.countryCode,
        isWhatsAppNumber: formState.whatsapp,
        termsAccepted: formState.terms,
        marketingConsent: formState.consent,
      };
      const response = await axios.post(APPOINTMENTS_API, appointmentData);
      if (response.status === 201 || response.status === 200) {
        const responseData = response.data;

        // Check if the response contains an error message
        if (responseData.error) {
          toasterConfig("error",responseData.error);
          return;
        }

        // Check if the response contains the success message
        if (responseData.message === "Appointment booked successfully") {
          setFormState(initialState);
          toasterConfig("success","Appointment booked successfully!");
        } else {
          toasterConfig("error","Unexpected response format");
        }
      }
    } catch (error) {
      console.error("Error booking appointment:", error);

      // Handle different types of error responses
      if (error.response?.data?.error) {
        // Handle API error responses like "Slot already booked"
        toasterConfig("error",error.response.data.error);
      } else if (error.response?.data?.message) {
        // Handle other API error messages
        toasterConfig("error",error.response.data.message);
      } else if (error.response?.status === 409) {
        // Handle conflict status (slot already booked)
        toasterConfig("error",
          "This time slot is already booked. Please select a different time."
        );
      } else if (error.response?.status === 400) {
        // Handle bad request
        toasterConfig("error","Invalid appointment data. Please check your inputs.");
      } else {
        // Handle network or other errors
        toasterConfig("error","Failed to book appointment. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="container-fluid">
        <div className="banner mb-12">
          <div className="container mx-auto">
            <div className="row">
              <div className="col-lg-12">
                <h2 className="banner-title">Book Appointment</h2>
                <div className="breadcrumb">
                  <a href="/">Home</a> <span>/</span>
                  <span>Book Appointment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container pb-8">
        <div className="row">
          <div className="col-lg-8">
            <div className="booking-form-container">
              <h2 className="booking-form-title">
                Book a Doctor’s Appointment
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="booking-form-row">
                  <div className="booking-form-group">
                    <label for="mobile" className="booking-form-label">
                      Mobile Number
                    </label>
                    <div className="flex">
                      <select
                        name="countryCode"
                        className="booking-form-input w-24 mr-2"
                        value={formState.countryCode}
                        onChange={handleChange}
                        style={{ minWidth: "70px" }}
                      >
                        <option value="">Code</option>
                        {countryCodes.map((code) => (
                          <option value={code.dial_code} key={code.code}>
                            {code.dial_code}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        id="mobile"
                        name="mobile"
                        className="booking-form-input flex-1"
                        value={formState.mobile}
                        onChange={handleChange}
                        placeholder="Enter mobile number"
                      />
                    </div>
                  </div>
                  <div className="booking-form-group">
                    <label for="fullName" className="booking-form-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      className="booking-form-input"
                      value={formState.fullName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                    />
                  </div>
                </div>
                <div className="booking-form-checkbox-group">
                  <input
                    type="checkbox"
                    id="whatsapp-bform"
                    name="whatsapp"
                    className="booking-form-checkbox"
                    checked={formState.whatsapp}
                    onChange={handleChange}
                  />
                  <label
                    for="whatsapp-bform"
                    className="booking-form-checkbox-label"
                  >
                    This is my WhatsApp Number
                  </label>
                </div>
                <div className="booking-form-row">
                  {" "}
                  <div className="booking-form-group">
                    <label for="email" className="booking-form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="booking-form-input"
                      value={formState.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="booking-form-group">
                    <label for="doctor" className="booking-form-label">
                      Select Doctor
                    </label>
                    <select
                      id="doctor"
                      name="doctorID"
                      className="booking-form-select"
                      value={formState?.doctorID}
                      onChange={handleChange}
                    >
                      <option value="">-- Select Doctor --</option>
                      {doctors?.map((doctor, index) => (
                        <option key={index} value={doctor.doctorID}>
                          {doctor.fullName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="booking-form-row">
                  <div className="booking-form-group">
                    <label for="date" className="booking-form-label">
                      Select Appointment Date
                    </label>
                    <input
                      type="date"
                      id="appointmentDate"
                      name="appointmentDate"
                      className="booking-form-input"
                      value={formatDateForInput(formState?.appointmentDate)}
                      onChange={(date) => {
                        handleDateChange("appointmentDate", date);
                        if (dateInputRef.current) {
                          setTimeout(() => dateInputRef.current.blur(), 0);
                        }
                      }}
                      min={formatDateForInput(new Date())}
                      max={formatDateForInput(
                        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                      )}
                      ref={dateInputRef}
                      onFocus={() => {
                        if (
                          dateInputRef.current &&
                          dateInputRef.current.showPicker
                        ) {
                          dateInputRef.current.showPicker();
                        }
                      }}
                    />
                  </div>
                  <div className="booking-form-group">
                    <label for="startTime" className="booking-form-label">
                      Select Time Slot
                    </label>
                    <select
                      className="booking-form-select"
                      name="startTime"
                      id="startTime"
                      value={formState.startTime}
                      onChange={handleStartTimeChange}
                      //   invalid={!!formErrors.startTime}
                      disabled={availableSlots.length === 0}
                      style={
                        availableSlots.length === 0
                          ? {
                              backgroundColor: "lightgray",
                            }
                          : {}
                      }
                    >
                      <option value="">
                        {isLoadingSlots
                          ? "Loading slots..."
                          : availableSlots.length === 0
                          ? "No slots available"
                          : "--- Select Time Slot ---"}
                      </option>
                      {availableSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="booking-form-checkbox-group">
                  <input
                    type="checkbox"
                    id="terms-bform"
                    name="terms"
                    className="booking-form-checkbox"
                    checked={formState.terms}
                    onChange={handleChange}
                  />
                  <label
                    for="terms-bform"
                    className="booking-form-checkbox-label"
                  >
                    I agree to the Terms & Conditions and Privacy Policy.
                  </label>
                </div>
                <div className="booking-form-checkbox-group">
                  <input
                    type="checkbox"
                    id="consent-bform"
                    name="consent"
                    className="booking-form-checkbox"
                    value={formState.consent}
                    onChange={handleChange}
                  />
                  <label
                    for="consent-bform"
                    className="booking-form-checkbox-label"
                  >
                    I agree to be contacted by Agastya Hospital or its
                    representative through SMS/Email, WhatsApp or call. This
                    consent will override any registration for NDNC.
                  </label>
                </div>
                <button type="submit" className="booking-form-btn-submit">
                  Submit
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-4">
            <aside className="appointment-sidebar">
              <div className="sidebar-section sep">
                <h5 className="title">
                  If you need any assistance in booking an appointment, please
                  call our 24/7 Helpline Number
                </h5>
                <ul className="sep">
                  <li>040 - 65 108 108</li>
                  <li>+91 9459 108 108</li>
                </ul>
              </div>

              <div className="sidebar-section">
                <h5 className="title">
                  Visit our hospital for a free second opinion
                </h5>
                <ul className="sep">
                  <li>
                    Nagarjuna Sagar Rd, Jahangir Nagar Colony, Omkar Nagar,
                    Hyderabad, Telangana 500074
                  </li>
                  <li style={{ listStyle: "none" }}>
                    <a href="#" className="directions-btn">
                      View Directions
                    </a>
                  </li>
                </ul>
              </div>

              <div className="sidebar-section">
                <h5 className="title">
                  Book an ambulance in case of an emergency
                </h5>
                <ul>
                  <li>040 - 65 108 108</li>
                  <li>+91 9459 108 108</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
