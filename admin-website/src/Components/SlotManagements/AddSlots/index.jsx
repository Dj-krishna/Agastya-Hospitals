import React, { useEffect, useState } from "react";
import { Breadcrumbs, Btn } from "../../../AbstractElements";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  InputGroup,
  Label,
  Row,
  Alert,
  Spinner,
} from "reactstrap";
import ValidationAlert from "../../Common/Component/ValidationAlert";
import { fetchDataGet, fetchDataPost } from "../../../api/Services";
import { DOCTORS_API, SLOTS_API } from "../../../api";
import DatePicker from "react-datepicker";
import { FaCalendar, FaCalendarAlt, FaClock } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "../../../slices/doctorsSlice";

const today = new Date();
const initialFormState = {
  selectedDoctor: "",
  fromDate: today,
  toDate: today,
  morningFrom: "",
  morningTo: "",
  eveningFrom: "",
  eveningTo: "",
};

const initialFormErrors = {
  selectedDoctor: "",
  fromDate: "",
  toDate: "",
  morningFrom: "",
  morningTo: "",
  eveningFrom: "",
  eveningTo: "",
};

function AddSlots() {
  const [formState, setFormState] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [enableReset, setEnableReset] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ show: false, type: "", message: "" });

  const dispatch = useDispatch();
  const { data: doctors } = useSelector((state) => {
    return state.doctors;
  });

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

  const parseToMinutes = (time) => {
    if (!time) return null;
    // Normalize and support inputs like "02:30 pm" or "2:30PM"
    const normalized = String(time).trim().toLowerCase();
    const ampmMatch = normalized.match(/^(\d{1,2}):(\d{2})\s*([ap]m)$/i);
    if (ampmMatch) {
      let hours = parseInt(ampmMatch[1], 10);
      const minutes = parseInt(ampmMatch[2], 10);
      const period = ampmMatch[3].toLowerCase();
      if (period === "pm" && hours !== 12) hours += 12;
      if (period === "am" && hours === 12) hours = 0;
      return hours * 60 + minutes;
    }
    const match24 = normalized.match(/^(\d{1,2}):(\d{2})$/);
    if (match24) {
      const hours = parseInt(match24[1], 10);
      const minutes = parseInt(match24[2], 10);
      return hours * 60 + minutes;
    }
    return null;
  };

  const isEndAfterStart = (start, end) => {
    const s = parseToMinutes(start);
    const e = parseToMinutes(end);
    if (s == null || e == null) return true;
    return e > s;
  };

  const formatTimeTo24 = (time) => {
    if (!time) return time;
    const normalized = String(time).trim().toLowerCase();
    const ampmMatch = normalized.match(/^(\d{1,2}):(\d{2})\s*([ap]m)$/i);
    if (ampmMatch) {
      let hours = parseInt(ampmMatch[1], 10);
      const minutes = ampmMatch[2];
      const period = ampmMatch[3].toLowerCase();
      if (period === "pm" && hours !== 12) hours += 12;
      if (period === "am" && hours === 12) hours = 0;
      return `${String(hours).padStart(2, "0")}:${minutes}`;
    }
    const match24 = normalized.match(/^(\d{1,2}):(\d{2})$/);
    if (match24) {
      const hours = String(parseInt(match24[1], 10)).padStart(2, "0");
      const minutes = match24[2];
      return `${hours}:${minutes}`;
    }
    return time;
  };

  const validateField = (field, value) => {
    switch (field) {
      case "selectedDoctor":
        return value === "" ? "Please select a doctor" : "";
      case "fromDate":
        return !value ? "From Date is required" : "";
      case "toDate":
        return !value ? "To Date is required" : "";
      case "morningFrom":
        return value === "" ? "Select a start time" : "";
      case "morningTo":
        return value === "" ? "Select an end time" : "";
      case "eveningFrom":
        return value === "" ? "Select a start time" : "";
      case "eveningTo":
        return value === "" ? "Select an end time" : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => {
      const next = { ...prev, [name]: value };
      // If FROM changes, reset TO if it becomes invalid
      if (name === "morningFrom" && next.morningTo && !isEndAfterStart(value, next.morningTo)) {
        next.morningTo = "";
      }
      if (name === "eveningFrom" && next.eveningTo && !isEndAfterStart(value, next.eveningTo)) {
        next.eveningTo = "";
      }
      return next;
    });
    if (isSubmitted) {
      const errorMsg = validateField(name, value);
      setFormErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }
    setEnableReset(true);
  };

  const handleDateChange = (dateName, date) => {
    setFormState({ ...formState, [dateName]: date });
    if (isSubmitted) {
      const errorMsg = validateField(dateName, date);
      setFormErrors((prev) => ({ ...prev, [dateName]: errorMsg }));
    }
    setEnableReset(true);
  };

  const formatDateForAPI = (date) => {
    return date.toISOString();
  };

  const findDoctorId = (doctorName) => {
    const doctor = doctors.find(doc => doc.fullName === doctorName);
    // Try different possible ID fields
    return doctor ? (doctor.id || doctor.doctorID || doctor._id) : null;
  };

  const handleSubmit = async (e, data) => {
    e.preventDefault();
    setIsSubmitted(true);
    //setEnableReset(true);
    const newErrors = {};
    Object.keys(formState).forEach((key) => {
      const error = validateField(key, formState[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    // Cross-field validation: ensure TO > FROM for selected sessions
    if (formState.morningFrom && formState.morningTo && !isEndAfterStart(formState.morningFrom, formState.morningTo)) {
      newErrors.morningTo = "End time must be greater than start time";
    }
    if (formState.eveningFrom && formState.eveningTo && !isEndAfterStart(formState.eveningFrom, formState.eveningTo)) {
      newErrors.eveningTo = "End time must be greater than start time";
    }
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // Additional validation: check if at least one time slot is selected
      const hasMorningSlot = formState.morningFrom && formState.morningTo;
      const hasEveningSlot = formState.eveningFrom && formState.eveningTo;
      
      if (!hasMorningSlot && !hasEveningSlot) {
        setFormErrors({
          morningFrom: "Please select at least one time slot (morning or evening)",
          eveningFrom: "Please select at least one time slot (morning or evening)"
        });
        return;
      }
      
      setIsLoading(true);
      setAlertMessage({ show: false, type: "", message: "" });
      
      try {
        const doctorId = findDoctorId(formState.selectedDoctor);
        if (!doctorId) {
          throw new Error("Doctor not found");
        }

        const appointmentData = {
          doctorID: doctorId,
          fromDate: formatDateForAPI(formState.fromDate),
          toDate: formatDateForAPI(formState.toDate),
          morningSlot: formState.morningFrom && formState.morningTo ? {
            from: formatTimeTo24(formState.morningFrom),
            to: formatTimeTo24(formState.morningTo)
          } : null,
          eveningSlot: formState.eveningFrom && formState.eveningTo ? {
            from: formatTimeTo24(formState.eveningFrom),
            to: formatTimeTo24(formState.eveningTo)
          } : null,
          isActive: true
        };

        // Remove null slots from the request
        if (!appointmentData.morningSlot) {
          delete appointmentData.morningSlot;
        }
        if (!appointmentData.eveningSlot) {
          delete appointmentData.eveningSlot;
        }

        console.log("Submitting appointment data:", appointmentData);
        
        const response = await fetchDataPost(SLOTS_API, appointmentData);
        
        console.log("API Response:", response);
        
        setAlertMessage({
          show: true,
          type: "success",
          message: "Slots created successfully!"
        });
        
        // Reset form after successful submission
        setTimeout(() => {
          handleReset();
          setAlertMessage({ show: false, type: "", message: "" });
        }, 3000);
        
      } catch (error) {
        
        let errorMessage = "Failed to create slots. Please try again.";
        
        if (error.response) {
          // Server responded with error status
          const status = error.response.status;
          const data = error.response.data;
          errorMessage = data.error;
        } 
        
        setAlertMessage({
          show: true,
          type: "error",
          message: errorMessage
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log("Form has errors:", newErrors);
    }
  };

  const handleReset = () => {
    setFormState({
      selectedDoctor: "",
      fromDate: today,
      toDate: today,
      morningFrom: "",
      morningTo: "",
      eveningFrom: "",
      eveningTo: "",
    });
    setFormErrors({});
    setEnableReset(false);
    setIsSubmitted(false);
    setAlertMessage({ show: false, type: "", message: "" });
  };

  return (
    <>
      <Breadcrumbs mainTitle="Add Slots For Doctor" btnColor={"secondary"} />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                {alertMessage.show && (
                  <Alert color={alertMessage.type} className="mb-3">
                    {alertMessage.message}
                  </Alert>
                )}
                
                <Form
                  className="needs-validation"
                  noValidate=""
                  onSubmit={(e) => handleSubmit(e, formState)}
                >
                  <Row>
                    <Col md="4 mb-3">
                      <Label for="selectedDoctor">Select Doctor</Label>
                      <Input
                        type="select"
                        name="selectedDoctor"
                        id="selectedDoctor"
                        value={formState.selectedDoctor}
                        onChange={handleChange}
                        invalid={!!formErrors.selectedDoctor}
                      >
                        <option value="">Select a doctor</option>
                        {doctors.map((doc, index) => (
                          <option key={index} value={doc.fullName}>
                            {doc.fullName}
                          </option>
                        ))}
                      </Input>
                      <ValidationAlert error={formErrors.selectedDoctor} />
                    </Col>
                    <Col md={8} className="">
                      {" "}
                    </Col>

                    <Col md={4} className="">
                      <Label for="fromDate">From Date</Label>

                      <InputGroup>
                        <DatePicker
                          className="form-control datetimepicker-input digits"
                          selected={formState.fromDate}
                          onChange={(date) =>
                            handleDateChange("fromDate", date)
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

                      <ValidationAlert error={formErrors.fromDate} />
                    </Col>
                    <Col md={4} className="">
                      <Label for="toDate">To Date</Label>
                      <InputGroup>
                        <DatePicker
                          className="form-control datetimepicker-input digits"
                          selected={formState.toDate}
                          onChange={(date) => handleDateChange("toDate", date)}
                          dateFormat="dd/MM/yyyy"
                          minDate={formState.fromDate}
                        />
                        <div
                          className="input-group-text"
                          data-target="#dt-date"
                          data-toggle="datetimepicker"
                        >
                          <FaCalendarAlt />
                        </div>
                      </InputGroup>

                      <ValidationAlert error={formErrors.toDate} />
                    </Col>
                  </Row>
                  {/* Morning Slots */}
                  <h6 className="mt-4">Morning Slots</h6>
                  <Row>
                    <Col md={4} className="mt-1">
                      <Label for="morningFrom">From</Label>
                      <Input
                        type="select"
                        name="morningFrom"
                        id="morningFrom"
                        value={formState.morningFrom}
                        onChange={handleChange}
                        invalid={!!formErrors.morningFrom}
                      >
                        <option value="">Select FROM Slot</option>
                        {morningTimeSlots.map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </Input>

                      <ValidationAlert error={formErrors.morningFrom} />
                    </Col>
                    <Col md={4} className="mt-1">
                      <Label for="morningTo">To</Label>
                      <Input
                        type="select"
                        name="morningTo"
                        id="morningTo"
                        value={formState.morningTo}
                        onChange={handleChange}
                        invalid={!!formErrors.morningTo}
                      >
                        <option value="">Select TO Slot</option>
                        {morningTimeSlots.map((slot) => (
                          <option
                            key={slot}
                            value={slot}
                            disabled={
                              formState.morningFrom &&
                              parseToMinutes(slot) <= parseToMinutes(formState.morningFrom)
                            }
                          >
                            {slot}
                          </option>
                        ))}
                      </Input>

                      <ValidationAlert error={formErrors.morningTo} />
                    </Col>
                    <Col md={4}> </Col>
                  </Row>
                  <h6 className="mt-4">Evening Slots</h6>
                  <Row>
                    <Col md={4} className="mt-1">
                      <Label for="eveningFrom">From</Label>
                      <Input
                        type="select"
                        name="eveningFrom"
                        id="eveningFrom"
                        value={formState.eveningFrom}
                        onChange={handleChange}
                        invalid={!!formErrors.eveningFrom}
                      >
                        <option value="">Select FROM Slot</option>
                        {eveningTimeSlots.map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </Input>
                      <ValidationAlert error={formErrors.eveningFrom} />
                    </Col>
                    <Col md={4} className="mt-1">
                      <Label for="eveningTo">To</Label>
                      <Input
                        type="select"
                        name="eveningTo"
                        id="eveningTo"
                        value={formState.eveningTo}
                        onChange={handleChange}
                        invalid={!!formErrors.eveningTo}
                      >
                        <option value="">Select TO Slot</option>
                        {eveningTimeSlots.map((slot) => (
                          <option
                            key={slot}
                            value={slot}
                            disabled={
                              formState.eveningFrom &&
                              parseToMinutes(slot) <= parseToMinutes(formState.eveningFrom)
                            }
                          >
                            {slot}
                          </option>
                        ))}
                      </Input>
                      <ValidationAlert error={formErrors.eveningTo} />
                    </Col>
                    <Col md={4}> </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col>
                      <Button type="submit" color="primary" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Creating Slots...
                          </>
                        ) : (
                          "Save"
                        )}
                      </Button>
                      &nbsp;&nbsp;
                      <Button
                        type="reset"
                        color="secondary"
                        onClick={handleReset}
                        disabled={!enableReset || isLoading}
                      >
                        Reset
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
}

export default AddSlots;
