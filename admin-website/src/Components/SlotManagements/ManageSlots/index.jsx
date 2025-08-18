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
  Alert
} from "reactstrap";
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import { Breadcrumbs } from "../../../AbstractElements";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "../../../slices/doctorsSlice";
import { FaCalendarAlt } from "react-icons/fa";
import { SLOTS_API } from "../../../api";
import { fetchDataGet, fetchDataPut } from "../../../api/Services";


const generateSlots = (startMinutes, endMinutes) => {
  const out = [];
  for (let m = startMinutes; m <= endMinutes; m += 30) {
    const h = Math.floor(m / 60);
    const mm = m % 60 === 0 ? "00" : "30";
    out.push(`${String(h).padStart(2, "0")}:${mm}`);
  }
  return out;
};

const MORNING_RANGE = generateSlots(0, 11 * 60 + 30); // 00:00 - 11:30
const EVENING_RANGE = generateSlots(12 * 60, 23 * 60 + 30); // 12:00 - 23:30

function ManageSlots(params) {
  const [formData, setFormData] = useState({
    doctor: "",
    date: new Date(),
    morningSlots: [],
    eveningSlots: [],
  });

  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState({ show: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [slotIdForDoctor, setSlotIdForDoctor] = useState(null);
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
    // if (
    //   formData.morningSlots.length === 0 ||
    //   formData.eveningSlots.length === 0
    // ) {
    //   errs.slots = "At least one time slot must be selected";
    // }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const findDoctorId = (doctorName) => {
    const doctor = doctors.find((doc) => doc.fullName === doctorName);
    return doctor ? (doctor.id || doctor.doctorID || doctor._id) : null;
  };

  const formatDateYYYYMMDD = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const extractSlotsForDate = (schedules, date) => {
    // Compare only by date portion
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const target = `${y}-${m}-${d}`;
    for (const sch of schedules) {
      if (!Array.isArray(sch.eachSchedule)) continue;
      for (const each of sch.eachSchedule) {
        if (!each.date) continue;
        const datePart = String(each.date).slice(0, 10);
        if (datePart === target) {
          return {
            morning: Array.isArray(each.morningSlot) ? each.morningSlot : [],
            evening: Array.isArray(each.eveningSlot) ? each.eveningSlot : [],
          };
        }
      }
    }
    return { morning: [], evening: [] };
  };

  const loadExistingSlots = async (doctorName, date) => {
    const doctorId = findDoctorId(doctorName);
    if (!doctorId || !date) return;
    setLoading(true);
    try {
      const data = await fetchDataGet(
        `${SLOTS_API}?doctorID=${doctorId}&date=${encodeURIComponent(
          formatDateYYYYMMDD(date)
        )}`
      );
      let candidate = null;
      if (Array.isArray(data)) {
        candidate = data.find((item) => Array.isArray(item.schedule));
      } else if (data && Array.isArray(data.schedule)) {
        candidate = data;
      }

      if (candidate) {
        setSlotIdForDoctor(candidate.slotID || candidate._id || null);
        const { morning, evening } = extractSlotsForDate(candidate.schedule, date);
        setFormData((prev) => ({
          ...prev,
          morningSlots: morning.filter((t) => MORNING_RANGE.includes(t)),
          eveningSlots: evening.filter((t) => EVENING_RANGE.includes(t)),
        }));
      } else {
        setSlotIdForDoctor(null);
        setFormData((prev) => ({ ...prev, morningSlots: [], eveningSlots: [] }));
      }
    } catch (e) {
      console.error("Failed to load existing slots", e);
      setSlotIdForDoctor(null);
      setFormData((prev) => ({ ...prev, morningSlots: [], eveningSlots: [] }));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const doctorId = findDoctorId(formData.doctor);
    if (!doctorId) {
      setErrors({ ...errors, doctor: "Doctor is required" });
      return;
    }

    const payload = {
      fromDate: formatDateYYYYMMDD(formData.date),
      toDate: formatDateYYYYMMDD(formData.date),
      morningSlot: formData.morningSlots
        .slice()
        .sort()
        .filter((t) => MORNING_RANGE.includes(t)),
      eveningSlot: formData.eveningSlots
        .slice()
        .sort()
        .filter((t) => EVENING_RANGE.includes(t)),
    };

    try {
      setLoading(true);
      const url = slotIdForDoctor
        ? `${SLOTS_API}?slotID=${slotIdForDoctor}`
        : `${SLOTS_API}?doctorID=${doctorId}`;
      const res = await fetchDataPut(url, payload);
      console.log("Update response", res);
      setAlertMessage({
          show: true,
          type: "success",
          message: "Slots updated successfully!"
      });
    } catch (err) {
      console.error("Failed to update slots", err);
    } finally {
      setLoading(false);
    }
  };

  const renderSlotRow = (session) => (
    <Row className="my-3">
      {(session === "morningSlots" ? MORNING_RANGE : EVENING_RANGE).map((time, index) => (
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
                {alertMessage.show && (
                  <Alert color={alertMessage.type} className="mb-3">
                    {alertMessage.message}
                  </Alert>
                )}
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="doctor">Select Doctor</Label>
                        <Input
                          type="select"
                          id="doctor"
                          value={formData.doctor}
                          onChange={(e) => {
                            const doctor = e.target.value;
                            setFormData({ ...formData, doctor });
                            if (doctor && formData.date) {
                              loadExistingSlots(doctor, formData.date);
                            }
                          }}
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
                            onChange={(date) => {
                              setFormData({ ...formData, date });
                              if (formData.doctor) {
                                loadExistingSlots(formData.doctor, date);
                              }
                            }}
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
