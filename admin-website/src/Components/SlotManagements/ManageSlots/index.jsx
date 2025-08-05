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
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import { Breadcrumbs } from "../../../AbstractElements";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "../../../slices/doctorsSlice";
import { FaCalendarAlt } from "react-icons/fa";

const timeOptions = [
  "9:00",
  "9:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
];

function ManageSlots(params) {
  const [formData, setFormData] = useState({
    doctor: "",
    date: new Date(),
    morningSlots: [],
    eveningSlots: [],
  });

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { data: doctors } = useSelector((state) => {
    return state.doctors;
  });

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  const handleCheckboxChange = (session, time) => {
    setFormData((prev) => {
      const updatedSlots = prev[session].includes(time)
        ? prev[session].filter((t) => t !== time)
        : [...prev[session], time];

      return {
        ...prev,
        [session]: updatedSlots,
      };
    });
  };

  const validate = () => {
    const errs = {};
    if (!formData.doctor) errs.doctor = "Doctor is required";
    if (!formData.date) errs.date = "Date is required";
    if (
      formData.morningSlots.length === 0 ||
      formData.eveningSlots.length === 0
    ) {
      errs.slots = "At least one time slot must be selected";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Send formData to backend or handle as needed
    console.log("Submitted Data:", formData);
  };

  const renderSlotRow = (session) => (
    <Row className="my-3">
      {timeOptions.map((time, index) => (
        <Col key={index} xs="auto">
          <Label className="d-block" for={`${session}SlotCheck${index}`}>
            <Input
              className="checkbox_animated"
              id={`${session}SlotCheck${index}`}
              type="checkbox"
              checked={formData[session].includes(time)}
              onChange={() => handleCheckboxChange(session, time)}
            />
            {time}
          </Label>
        </Col>
      ))}
    </Row>
  );

  return (
    <>
      <Breadcrumbs mainTitle="Manage Slots" btnColor={"secondary"} />
      <Container fluid>
        <Row>
          <Col md={12}>
            <Card className="">
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="doctor">Select Doctor</Label>
                        <Input
                          type="select"
                          id="doctor"
                          value={formData.doctor}
                          onChange={(e) =>
                            setFormData({ ...formData, doctor: e.target.value })
                          }
                          invalid={!!errors.doctor}
                        >
                          <option value="">Select a Doctor</option>
                          {doctors.map((doc, index) => (
                            <option key={index} value={doc.fullName}>
                              {doc.fullName}
                            </option>
                          ))}
                        </Input>
                        <FormFeedback>{errors.doctor}</FormFeedback>
                      </FormGroup>
                    </Col>

                    <Col md={4}>
                      <FormGroup>
                        <Label for="date">Select Date</Label>
                        <InputGroup>
                          <DatePicker
                            className="form-control datetimepicker-input digits"
                            selected={formData.date}
                            onChange={(date) =>
                              setFormData({ ...formData, date })
                            }
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Choose date"
                          />
                          <div
                            className="input-group-text"
                            data-target="#dt-date"
                            data-toggle="datetimepicker"
                          >
                            <FaCalendarAlt />
                          </div>
                        </InputGroup>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col>
                      <Label>Morning Slots</Label>
                      {renderSlotRow("morningSlots")}
                      {errors.morningSlots && (
                        <div className="text-danger mb-2">
                          {errors.morningSlots}
                        </div>
                      )}
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col>
                      <Label>Evening Slots</Label>
                      {renderSlotRow("eveningSlots")}
                      {errors.eveningSlots && (
                        <div className="text-danger mb-2">
                          {errors.eveningSlots}
                        </div>
                      )}
                    </Col>
                  </Row>

                  {errors.slots && (
                    <div className="text-danger mt-2">{errors.slots}</div>
                  )}

                  <Row className="mt-4">
                    <Col md={6}>
                      <Button color="primary" type="submit">
                        Update
                      </Button>
                      &nbsp;&nbsp;&nbsp;
                      <Button
                        color="secondary"
                        className="ms-2"
                        type="button"
                        // onClick={() => alert("Cancelled")}
                      >
                        Cancel
                      </Button>
                    </Col>
                    <Col md={6} className="text-end text-muted">
                      {" "}
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

export default ManageSlots;
