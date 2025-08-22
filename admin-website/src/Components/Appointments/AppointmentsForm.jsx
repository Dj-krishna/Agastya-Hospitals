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
import { APPOINTMENTS_API } from "../../api";
import { toast } from "react-toastify";

const today = new Date();
const initialFormState = {
  fullName: "",
  mobile: "",
  countryCode: "+91",
  email: "",
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

  const dispatch = useDispatch();
  const { data: doctors } = useSelector((state) => state.doctors);
  const { data: patients } = useSelector((state) => state.patients);

  useEffect(() => {
    dispatch(fetchDoctors());
    dispatch(fetchPatients());
  }, [dispatch]);

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
      case "appointmentDate":
        if (!value) return "Appointment date is required";
        return "";
      case "doctorID":
        if (!value) return "Doctor selection is required";
        return "";
      case "patientID":
        if (!value) return "Patient selection is required";
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
  };

  const handleEndTimeChange = (e) => {
    const endTime = e.target.value;
    setFormState((prev) => ({ ...prev, endTime }));

    if (isSubmitted) {
      const errorMsg = validateField("endTime", endTime);
      setFormErrors((prev) => ({ ...prev, endTime: errorMsg }));
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
      try {
        // Format date to YYYY-MM-DD
        const formattedDate = formState.appointmentDate
          .toISOString()
          .split("T")[0];

        const appointmentData = {
          patientName: formState.fullName,
          doctorID: parseInt(formState.doctorID),
          patientID: parseInt(formState.patientID),
          date: formattedDate,
          startTime: formState.startTime,
          endTime: formState.endTime,
          status: "booked",
        };

        const response = await axios.post(APPOINTMENTS_API, appointmentData);

        if (response.status === 201 || response.status === 200) {
          toast.success("Appointment booked successfully!");
          if (onAppointmentAdded) {
            onAppointmentAdded(response.data);
          }
          onClose();
        }
      } catch (error) {
        console.error("Error booking appointment:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Failed to book appointment. Please try again.";
        toast.error(errorMessage);
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

                    <Col md="4 mb-3">
                      <Label className="form-label" for="mobileNumber">
                        Mobile
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
                      <ValidationAlert error={formErrors.mobile} />
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
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Booking..." : "Book"}
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
