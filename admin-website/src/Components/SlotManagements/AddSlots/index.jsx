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
} from "reactstrap";
import ValidationAlert from "../../Common/Component/ValidationAlert";
import { fetchDataGet } from "../../../api/Services";
import { DOCTORS_API } from "../../../api";
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

  const dispatch = useDispatch();
  const { data: doctors } = useSelector((state) => {
    return state.doctors;
  });

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hours = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? "00" : "30";
    return `${String(hours).padStart(2, "0")}:${minutes}`;
  });

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
    setFormState((prev) => ({ ...prev, [name]: value }));
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

  const handleSubmit = (e, data) => {
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
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted successfully with data:", formState);
      // Here you can handle the form submission, e.g., send data to an API
    } else {
      console.log("Form has errors:", newErrors);
    }
  };

  const handleReset = () => {
    setFormState({
      selectedDoctor: "",
      fromDate: "",
      toDate: "",
      morningFrom: "",
      morningTo: "",
      eveningFrom: "",
      eveningTo: "",
    });
    setFormErrors({});
    setEnableReset(false);
  };

  return (
    <>
      <Breadcrumbs mainTitle="Add Slots For Doctor" btnColor={"secondary"} />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
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
                      <ValidationAlert error={formErrors.doctor} />
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
                        {timeSlots.map((slot) => (
                          <option key={slot}>{slot}</option>
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
                        {timeSlots.map((slot) => (
                          <option key={slot}>{slot}</option>
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
                        {timeSlots.map((slot) => (
                          <option key={slot}>{slot}</option>
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
                        {timeSlots.map((slot) => (
                          <option key={slot}>{slot}</option>
                        ))}
                      </Input>
                      <ValidationAlert error={formErrors.eveningTo} />
                    </Col>
                    <Col md={4}> </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col>
                      <Button type="submit" color="primary">
                        Save
                      </Button>
                      &nbsp;&nbsp;
                      <Button
                        type="reset"
                        color="secondary"
                        onClick={handleReset}
                        disabled={!enableReset}
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
