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
import { APPOINTMENTS_API, PATIENT_VERIFY_API,SLOTS_API } from "../../api";
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
  const [availableSlots, setAvailableSlots] = React.useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = React.useState(false);

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
      setAvailableSlots([]);
    };
  }, []);

  // Fetch available slots when doctor or date changes
  useEffect(() => {
    if (formState.doctorID && formState.appointmentDate) {
      fetchAvailableSlots();
    } else {
      setAvailableSlots([]);
      setFormState(prev => ({ ...prev, startTime: "" }));
      setFormErrors(prev => ({ ...prev, startTime: "" }));
    }
  }, [formState.doctorID, formState.appointmentDate]);

  const fetchAvailableSlots = async () => {
    if (!formState.doctorID || !formState.appointmentDate) return;

    setIsLoadingSlots(true);
    try {
      const formattedDate = formState.appointmentDate.toISOString().split('T')[0];
      const response = await axios.get(
        `${SLOTS_API}/available?doctorID=${formState.doctorID}&date=${formattedDate}`
      );

      // Check if the response contains an error message
      if (response.data && response.data.error) {
        setAvailableSlots([]);
        toast.error(response.data.error);
        return;
      }

      if (response.data && response.data.available && response.data.available.length > 0) {
        const slots = response.data.available[0];
        const allSlots = [
          ...(slots.morningSlot || []),
          ...(slots.eveningSlot || [])
        ];
        setAvailableSlots(allSlots);
      } else {
        setAvailableSlots([]);
        toast.warning("No available slots for the selected date and doctor.");
      }
    } catch (error) {
      console.error("Error fetching available slots:", error);
      setAvailableSlots([]);
      toast.error("Failed to fetch available slots. Please try again.");
    } finally {
      setIsLoadingSlots(false);
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
    const endTime = `${String(endHours).padStart(2, "0")}:${String(endMins).padStart(2, "0")}`;
    endOptions.push(endTime);

    return endOptions;
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
    if (!formState.doctorID || !formState.appointmentDate || !formState.startTime) {
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
      const formattedDate = formState.appointmentDate.toISOString().split('T')[0];
      const response = await axios.get(`${APPOINTMENTS_API}?doctorID=${formState.doctorID}&date=${formattedDate}`);
      
      if (response.data && response.data.appointments) {
        const conflictingAppointments = response.data.appointments.filter(appointment => {
          // Check if the time slots overlap
          const existingStart = appointment.startTime;
          const existingEnd = appointment.endTime;
          const newStart = formState.startTime;
          const newEnd = endTime;
          
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

    if (isSubmitted) {
      const errorMsg = validateField("startTime", startTime);
      setFormErrors((prev) => ({ ...prev, startTime: errorMsg }));
    }
    
    // Check slot availability when start time changes
    handleTimeOrDateChange();
  };



  // Check slot availability when time or date changes
  const handleTimeOrDateChange = () => {
    if (formState.doctorID && formState.appointmentDate && formState.startTime) {
      // Debounce the check to avoid too many API calls
      setTimeout(() => {
        checkSlotAvailability();
      }, 500);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Calculate end time based on start time
    let endTime = "";
    if (formState.startTime) {
      const endTimeOptions = generateEndTimeOptions(formState.startTime);
      if (endTimeOptions.length > 0) {
        endTime = endTimeOptions[0];
      }
    }
    
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
          endTime: endTime,
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
                      {formState.doctorID && formState.appointmentDate && isLoadingSlots && (
                        <small className="text-info">Fetching available slots...</small>
                      )}
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
                         disabled={isLoadingSlots || availableSlots.length === 0}
                       >
                         <option value="">
                           {isLoadingSlots ? "Loading slots..." : availableSlots.length === 0 ? "No slots available" : "Select start time"}
                         </option>
                         {availableSlots.map((slot) => (
                           <option key={slot} value={slot}>
                             {slot}
                           </option>
                         ))}
                       </Input>
                       {isLoadingSlots && <small className="text-info">Loading available slots...</small>}
                       {!isLoadingSlots && availableSlots.length === 0 && formState.doctorID && formState.appointmentDate && (
                         <small className="text-warning">No slots available for selected date and doctor</small>
                       )}
                       {isCheckingSlot && <small className="text-info">Checking slot availability...</small>}
                       <ValidationAlert error={formErrors.startTime} />
                     </Col>
                    <Col md="6 mb-3">
                      <Label for="endTime">End Time</Label>
                      <Input
                        type="text"
                        name="endTime"
                        id="endTime"
                        value={formState.startTime ? generateEndTimeOptions(formState.startTime)[0] || "" : ""}
                        readOnly
                        className="form-control"
                        placeholder="Will be set automatically"
                      />
                      {!formState.startTime && (
                        <small className="text-muted">End time will be automatically set to 30 minutes after start time</small>
                      )}
                      {formState.startTime && (
                        <small className="text-info">End time is automatically set to 30 minutes after start time</small>
                      )}
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
                        disabled={isSubmitting || isCheckingSlot || isLoadingSlots}
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
