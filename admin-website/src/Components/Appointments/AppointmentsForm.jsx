import React, { useEffect } from "react";
import { Breadcrumbs } from "../../AbstractElements";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row,
} from "reactstrap";
import ValidationAlert from "../Common/Component/ValidationAlert";
import { countryCodes } from "../../api/countryCode";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "../../slices/doctorsSlice";
import { fetchPatients } from "../../slices/patientSlice";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import { APPOINTMENTS_API, PATIENT_VERIFY_API } from "../../api";
import { toast } from "react-toastify";

const today = new Date();
const initialFormState = {
  fullName: "",
  mobile: "",
  countryCode: "+91",
  email: "",
  dob: "",
  gender: "",
  address: "",
  appointmentDate: today,
  doctorID: "",
  patientID: "",
  startTime: "",
  endTime: "",
  termsAndConditions: false,
};
const initialFormErrors = {
  fullName: "",
  mobile: "",
  countryCode: "",
  email: "",
  dob: "",
  gender: "",
  address: "",
  appointmentDate: "",
  doctorID: "",
  patientID: "",
  startTime: "",
  endTime: "",
  termsAndConditions: "",
};
const AppointmentsForm = ({ onClose, onAppointmentAdded }) => {
  const [formState, setFormState] = React.useState(initialFormState);
  const [formErrors, setFormErrors] = React.useState(initialFormErrors);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [patientExists, setPatientExists] = React.useState(null);
  const [verifiedPatient, setVerifiedPatient] = React.useState(null);
  const [isCheckingSlot, setIsCheckingSlot] = React.useState(false);

  const dispatch = useDispatch();
  const { data: doctors } = useSelector((state) => state.doctors);
  const { data: patients } = useSelector((state) => state.patients);

  useEffect(() => {
    dispatch(fetchDoctors());
    dispatch(fetchPatients());
  }, [dispatch]);

  // Reset form when component unmounts
  useEffect(() => {
    return () => {
      setFormState(initialFormState);
      setFormErrors(initialFormErrors);
      setIsSubmitted(false);
      setIsSubmitting(false);
      setIsVerifying(false);
      setPatientExists(null);
      setVerifiedPatient(null);
    };
  }, []);

  const generateTimeSlots = (startMinutes, endMinutes) => {
    const slots = [];
    for (let m = startMinutes; m <= endMinutes; m += 30) {
      const h = Math.floor(m / 60);
      const mm = m % 60 === 0 ? "00" : "30";
      slots.push(`${String(h).padStart(2, "0")}:${mm}`);
    }
    return slots;
  };

  const morningTimeSlots = generateTimeSlots(0, 11 * 60 + 30); // 00:00 to 11:30
  const eveningTimeSlots = generateTimeSlots(12 * 60, 23 * 60 + 30); // 12:00 to 23:30
  const allTimeSlots = [...morningTimeSlots, ...eveningTimeSlots];

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
        setFormState(prev => ({
          ...prev,
          fullName: patient.fullName,
          email: patient.email,
          countryCode: patient.countryCode,
          patientID: patient.patientID
        }));
        toast.success("Patient found! Details auto-filled.");
      } else {
        setVerifiedPatient(null);
        setFormState(prev => ({
          ...prev,
          patientID: ""
        }));
        toast.info("New patient. Please fill in additional details.");
      }
    } catch (error) {
      console.error("Error verifying mobile:", error);
      toast.error("Error verifying mobile number");
      setPatientExists(null);
      setVerifiedPatient(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const checkSlotAvailability = async () => {
    if (!formState.doctorID || !formState.appointmentDate || !formState.startTime || !formState.endTime) {
      return true; // Can't check without all required fields
    }

    setIsCheckingSlot(true);
    try {
      // Check if there are any existing appointments for the same doctor, date, and time
      const formattedDate = formState.appointmentDate.toISOString().split('T')[0];
      const response = await axios.get(`${APPOINTMENTS_API}?doctorID=${formState.doctorID}&date=${formattedDate}`);
      
      if (response.data && response.data.appointments) {
        const conflictingAppointments = response.data.appointments.filter(appointment => {
          // Check if the time slots overlap
          const existingStart = appointment.startTime;
          const existingEnd = appointment.endTime;
          const newStart = formState.startTime;
          const newEnd = formState.endTime;
          
          // Check for overlap: new appointment starts before existing ends AND new appointment ends after existing starts
          return (newStart < existingEnd && newEnd > existingStart);
        });

        if (conflictingAppointments.length > 0) {
          toast.error("This time slot conflicts with an existing appointment. Please select a different time.");
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
        if (!patientExists && !value) return "Date of birth is required for new patients";
        return "";
      case "gender":
        if (!patientExists && !value) return "Gender is required for new patients";
        return "";
      case "address":
        if (!patientExists && !value) return "Address is required for new patients";
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
      case "endTime":
        if (!value) return "End time is required";
        if (value && formState.startTime && value <= formState.startTime) {
          return "End time must be after start time";
        }
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
    const { name, value } = e.target;
    
    // If mobile number is changing, reset patient-related fields
    if (name === "mobile") {
      if (value.length === 10) {
        verifyMobileNumber(value);
      } else {
        // Reset patient verification status when mobile is incomplete
        setPatientExists(null);
        setVerifiedPatient(null);
        setFormState(prev => ({
          ...prev,
          patientID: "",
          fullName: "",
          email: "",
          dob: "",
          gender: "",
          address: ""
        }));
      }
    }
    
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    
    if (isSubmitted) {
      const errorMsg = validateField(name, value);
      setFormErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }
  };

  const handleDateChange = (dateName, date) => {
    setFormState({ ...formState, [dateName]: date });
    if (isSubmitted) {
      const errorMsg = validateField(dateName, date);
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

    // Auto-calculate end time (30 minutes later)
    if (startTime) {
      const [hours, minutes] = startTime.split(":");
      const startDate = new Date();
      startDate.setHours(parseInt(hours), parseInt(minutes), 0);

      const endDate = new Date(startDate.getTime() + 30 * 60000); // Add 30 minutes
      const endTime = `${String(endDate.getHours()).padStart(2, "0")}:${String(
        endDate.getMinutes()
      ).padStart(2, "0")}`;

      setFormState((prev) => ({ ...prev, endTime }));
    }

    if (isSubmitted) {
      const errorMsg = validateField("startTime", startTime);
      setFormErrors((prev) => ({ ...prev, startTime: errorMsg }));
    }
    
    // Check slot availability when start time changes
    handleTimeOrDateChange();
  };

  const handleEndTimeChange = (e) => {
    const endTime = e.target.value;
    setFormState((prev) => ({ ...prev, endTime }));

    if (isSubmitted) {
      const errorMsg = validateField("endTime", endTime);
      setFormErrors((prev) => ({ ...prev, endTime: errorMsg }));
    }
    
    // Check slot availability when end time changes
    handleTimeOrDateChange();
  };

  // Check slot availability when time or date changes
  const handleTimeOrDateChange = () => {
    if (formState.doctorID && formState.appointmentDate && formState.startTime && formState.endTime) {
      // Debounce the check to avoid too many API calls
      setTimeout(() => {
        checkSlotAvailability();
      }, 500);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    Object.keys(formState).forEach((field) => {
      const errorMsg = validateField(field, formState[field]);
      if (errorMsg) {
        errors[field] = errorMsg;
      }
    });
    setFormErrors(errors);

    setIsSubmitting(true);
    const isValid = Object.values(errors)
      .flat()
      .every((msg) => msg === "");
    if (isValid) {
      // Check slot availability before submitting
      const isSlotAvailable = await checkSlotAvailability();
      if (!isSlotAvailable) {
        setIsSubmitting(false);
        return;
      }
      
      try {
        // Format date to YYYY-MM-DD
        const formattedDate = formState.appointmentDate
          .toISOString()
          .split("T")[0];

        const appointmentData = {
          patientName: formState.fullName,
          mobile: formState.mobile,
          doctorID: parseInt(formState.doctorID),
          patientID: patientExists ? parseInt(formState.patientID) : null,
          date: formattedDate,
          startTime: formState.startTime,
          endTime: formState.endTime,
          status: "booked",
        };

        // If new patient, include patient details
        if (!patientExists) {
          appointmentData.fullName= formState.fullName;
          appointmentData.email= formState.email;
          appointmentData.dob= formState.dob;
          appointmentData.gender= formState.gender;
          appointmentData.address= formState.address;
          appointmentData.countryCode= formState.countryCode
        }

        const response = await axios.post(APPOINTMENTS_API, appointmentData);

        if (response.status === 201 || response.status === 200) {
          const responseData = response.data;
          
          // Check if the response contains an error message
          if (responseData.error) {
            toast.error(responseData.error);
            return;
          }
          
          // Check if the response contains the success message
          if (responseData.message === "Appointment booked successfully") {
            toast.success("Appointment booked successfully!");
            if (onAppointmentAdded) {
              onAppointmentAdded(responseData.appointment);
            }
            onClose();
          } else {
            toast.error("Unexpected response format");
          }
        }
      } catch (error) {
        console.error("Error booking appointment:", error);
        
        // Handle different types of error responses
        if (error.response?.data?.error) {
          // Handle API error responses like "Slot already booked"
          toast.error(error.response.data.error);
        } else if (error.response?.data?.message) {
          // Handle other API error messages
          toast.error(error.response.data.message);
        } else if (error.response?.status === 409) {
          // Handle conflict status (slot already booked)
          toast.error("This time slot is already booked. Please select a different time.");
        } else if (error.response?.status === 400) {
          // Handle bad request
          toast.error("Invalid appointment data. Please check your inputs.");
        } else {
          // Handle network or other errors
          toast.error("Failed to book appointment. Please try again.");
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error("Please fix the errors before submitting.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Breadcrumbs
        mainTitle={"Add Appointments"}
        buttonTitle={"Cancel"}
        btnColor={"secondary"}
        onClick={onClose}
      />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                <Form
                  className="needs-validation"
                  noValidate=""
                  onSubmit={onSubmit}
                >
                  <Row>
                    {/* Mobile Number - Always visible */}
                    <Col md="4 mb-3">
                      <Label className="form-label" for="mobileNumber">
                        Mobile Number
                      </Label>
                      <InputGroup
                        className={formErrors.mobile ? " is-invalid" : ""}
                      >
                        <Input
                          type="select"
                          name="countryCode"
                          value={formState.countryCode}
                          onChange={handleChange}
                          style={{ maxWidth: "100px" }}
                          invalid={!!formErrors.countryCode}
                        >
                          <option value="">Code</option>
                          {countryCodes.map((code) => (
                            <option value={code.dial_code} key={code.code}>
                              {code.dial_code}
                            </option>
                          ))}
                        </Input>
                        <Input
                          type="text"
                          name="mobile"
                          id="mobileNumber"
                          value={formState.mobile}
                          onChange={handleChange}
                          placeholder="Enter mobile number"
                          invalid={!!formErrors.mobile}
                          maxLength={10}
                        />
                      </InputGroup>
                      {isVerifying && <small className="text-info">Verifying...</small>}
                      {patientExists === true && <small className="text-success">✓ Patient found</small>}
                      {patientExists === false && <small className="text-warning">⚠ New patient</small>}
                      <ValidationAlert error={formErrors.mobile} />
                    </Col>

                    {/* Patient Selection - Only show when patient exists */}
                    {patientExists && (
                      <Col md="4 mb-3">
                        <Label className="form-label" for="patientID">
                          Select Patient
                        </Label>
                        <Input
                          type="select"
                          name="patientID"
                          id="patientID"
                          className="form-control digits"
                          value={formState.patientID}
                          onChange={handleChange}
                          invalid={!!formErrors.patientID}
                        >
                          <option value="">Select patient</option>
                          {patients?.map((patient, index) => (
                            <option key={index} value={patient.patientID}>
                              {patient.fullName}
                            </option>
                          ))}
                        </Input>
                        <ValidationAlert error={formErrors.patientID} />
                      </Col>
                    )}
                    {/* New Patient Fields - Only show when patient doesn't exist */}
                    {!patientExists && (
                      <>
                        <Col md="4 mb-3">
                          <Label className="form-label" for="fullName">
                            Full Name
                          </Label>
                          <Input
                            type="text"
                            name="fullName"
                            id="fullName"
                            value={formState.fullName}
                            onChange={handleChange}
                            placeholder="Enter full name"
                            invalid={!!formErrors.fullName}
                          />
                          <ValidationAlert error={formErrors.fullName} />
                        </Col>
                        <Col md="4 mb-3">
                          <Label htmlFor="email">Email</Label>
                          <InputGroup>
                            <InputGroupText>{"@"}</InputGroupText>
                            <Input
                              type="email"
                              name="email"
                              id="email"
                              value={formState.email}
                              onChange={handleChange}
                              invalid={!!formErrors.email}
                              placeholder="Enter email address"
                            />
                          </InputGroup>
                          <ValidationAlert error={formErrors.email} />
                        </Col>
                      </>
                    )}
                    <Col md="4 mb-3">
                      <Label className="form-label" for="doctorID">
                        Select Doctor
                      </Label>
                      <Input
                        type="select"
                        name="doctorID"
                        id="doctorID"
                        className="form-control digits"
                        value={formState.doctorID}
                        onChange={handleChange}
                        invalid={!!formErrors.doctorID}
                      >
                        <option value="">Select doctor</option>
                        {doctors?.map((doctor, index) => (
                          <option key={index} value={doctor.doctorID}>
                            {doctor.fullName}
                          </option>
                        ))}
                      </Input>
                      <ValidationAlert error={formErrors.doctorID} />
                    </Col>
                    <Col md="4 mb-3">
                      <Label for="appointmentDate">Appointment Date</Label>
                      <InputGroup>
                        <DatePicker
                          className="form-control datetimepicker-input digits"
                          selected={formState.appointmentDate}
                          onChange={(date) =>
                            handleDateChange("appointmentDate", date)
                          }
                          dateFormat="dd/MM/yyyy"
                          minDate={today}
                        />
                        <div
                          className="input-group-text"
                          data-target="#dt-date"
                          data-toggle="datetimepicker"
                        >
                          <FaCalendarAlt />
                        </div>
                      </InputGroup>
                      <ValidationAlert error={formErrors.appointmentDate} />
                    </Col>

                    {/* New Patient Additional Fields - Only show when patient doesn't exist */}
                    {!patientExists && (
                      <>
                        <Col md="4 mb-3">
                          <Label for="dob">Date of Birth</Label>
                          <DatePicker
                            className="form-control datetimepicker-input digits"
                            selected={formState.dob ? new Date(formState.dob) : null}
                            onChange={(date) => handleDateChange("dob", date)}
                            dateFormat="dd/MM/yyyy"
                            maxDate={new Date()}
                            placeholderText="Select date of birth"
                          />
                          <ValidationAlert error={formErrors.dob} />
                        </Col>
                        <Col md="4 mb-3">
                          <Label for="gender">Gender</Label>
                          <Input
                            type="select"
                            name="gender"
                            id="gender"
                            value={formState.gender}
                            onChange={handleChange}
                            invalid={!!formErrors.gender}
                          >
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </Input>
                          <ValidationAlert error={formErrors.gender} />
                        </Col>
                        <Col md="4 mb-3">
                          <Label for="address">Address</Label>
                          <Input
                            type="textarea"
                            name="address"
                            id="address"
                            value={formState.address}
                            onChange={handleChange}
                            placeholder="Enter address"
                            invalid={!!formErrors.address}
                            rows="3"
                          />
                          <ValidationAlert error={formErrors.address} />
                        </Col>
                      </>
                    )}

                                         <Col md="6 mb-3">
                       <Label for="startTime">Start Time</Label>
                       <Input
                         type="select"
                         name="startTime"
                         id="startTime"
                         value={formState.startTime}
                         onChange={handleStartTimeChange}
                         invalid={!!formErrors.startTime}
                       >
                         <option value="">Select start time</option>
                         {allTimeSlots.map((slot) => (
                           <option key={slot} value={slot}>
                             {slot}
                           </option>
                         ))}
                       </Input>
                       {isCheckingSlot && <small className="text-info">Checking slot availability...</small>}
                       <ValidationAlert error={formErrors.startTime} />
                     </Col>
                    <Col md="6 mb-3">
                      <Label for="endTime">End Time</Label>
                      <Input
                        type="select"
                        name="endTime"
                        id="endTime"
                        value={formState.endTime}
                        onChange={handleEndTimeChange}
                        invalid={!!formErrors.endTime}
                      >
                        <option value="">Select end time</option>
                        {allTimeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </Input>
                      <ValidationAlert error={formErrors.endTime} />
                    </Col>
                    <Col md="12" className="mt-3 text-center">
                      <Label className="d-block" for={"termsAndConditions"}>
                        <Input
                          className="checkbox_animated"
                          id={`termsAndConditions`}
                          type="checkbox"
                          checked={formState.termsAndConditions}
                          onChange={() =>
                            setFormState((prev) => ({
                              ...prev,
                              termsAndConditions: !prev.termsAndConditions,
                            }))
                          }
                        />
                        I agree to the terms and conditions
                      </Label>
                      <ValidationAlert error={formErrors.termsAndConditions} />
                    </Col>
                    <Col md="12" className="mt-3 text-center">
                      <Button
                        type="submit"
                        color="primary"
                        disabled={isSubmitting || isCheckingSlot}
                      >
                        {isCheckingSlot ? "Checking Slot..." : isSubmitting ? "Booking..." : "Book"}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AppointmentsForm;
