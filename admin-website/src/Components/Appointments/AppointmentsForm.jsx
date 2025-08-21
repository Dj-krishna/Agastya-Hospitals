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
import DatePicker from "react-datepicker";
import { FaCalendar, FaCalendarAlt, FaClock } from "react-icons/fa";

const today = new Date();
const initialFormState = {
  fullName: "",
  mobile: "",
  countryCode: "+91",
  email: "",
  appointmentDate: today,
  doctorID: "",
  termsAndConditions: "",
  timeSlot: "",
};
const initialFormErrors = {
  fullName: "",
  mobile: "",
  countryCode: "",
  email: "",
  appointmentDate: "",
  doctorID: "",
  termsAndConditions: "",
  timeSlot: "",
};
const AppointmentsForm = ({ onClose }) => {
  const [formState, setFormState] = React.useState(initialFormState);
  const [formErrors, setFormErrors] = React.useState(initialFormErrors);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const dispatch = useDispatch();
  const { data: doctors } = useSelector((state) => state.doctors);
  useEffect(() => {
    dispatch(fetchDoctors());
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
      case "timeSlot":
        if (!value) return "Time slot is required";
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
  const onSubmit = (e, formData) => {
    e.preventDefault();
    const errors = {};
    Object.keys(formData).forEach((field) => {
      const errorMsg = validateField(field, formData[field]);
      if (errorMsg) {
        errors[field] = errorMsg;
      }
    });
    setFormErrors(errors);
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) {
      return;
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
                  onSubmit={(e) => onSubmit(e, formState)}
                >
                  <Row>
                    <Col md="4 mb-3">
                      <Label className="form-label" for="fullName">
                        Full name
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
                        {doctors.map((doctor, index) => (
                          <option key={index} value={doctor.doctorID}>
                            {doctor.doctorID} - {doctor.fullName}
                          </option>
                        ))}
                      </Input>
                      <ValidationAlert error={formErrors.doctorID} />
                    </Col>
                    <Col md={4} className="">
                      <Label for="appointmentDate">From Date</Label>

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
                    <Col md={4} className="mt-1">
                      <Label for="timeSlot">Time Slot</Label>
                      <Input
                        type="select"
                        name="timeSlot"
                        id="timeSlot"
                        value={formState.timeSlot}
                        onChange={handleChange}
                        invalid={!!formErrors.timeSlot}
                      >
                        <option value="">Time Slot</option>
                        {[...morningTimeSlots, ...eveningTimeSlots].map(
                          (slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          )
                        )}
                      </Input>

                      <ValidationAlert error={formErrors.timeSlot} />
                    </Col>
                    <Col md={12} className="mt-3 text-center">
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
                    <Col md={12} className="mt-3 text-center">
                      <Button type="submit" color="primary">
                        Book
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
