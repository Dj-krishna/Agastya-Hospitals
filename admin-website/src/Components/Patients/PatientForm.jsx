import React, { useState, useEffect } from "react";
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
  Label,
  Row,
} from "reactstrap";
import ValidationAlert from "../Common/Component/ValidationAlert";
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import axios from "axios";
import { format } from "date-fns";
import { toasterConfig } from "../../utils";
import { PATIENT_API, UPDATE_PATIENT } from "../../api";

const initialFormData = {
  fullName: "",
  email: "",
  mobile: "",
  address: "",
  dob: new Date(),
  bloodGroup: "",
  altPhoneNumber: "",
  uhid: "",
  address: "",
  pastHistory: "",
  gender: "",
};
const initialFormErrors = {
  fullName: "",
  email: "",
  mobile: "",
  address: "",
  dob: "",
  bloodGroup: "",
  altPhoneNumber: "",
  uhid: "",
  address: "",
  pastHistory: "",
  gender: "",
};
const PatientForm = ({ onClose, formType, patientData }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setFormData({
      ...formData,
      ...patientData,
      uhid: patientData.patientID,
      dob: new Date(patientData.dob),
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" }); // Clear error on change
  };

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case "fullName":
        return value ? "" : "Full Name is required";
      case "mobile":
        return value ? "" : "Phone Number is required";
      case "address":
        return value ? "" : "Address is required";
      case "dob":
        return value ? "" : "Date of Birth is required";
      case "bloodGroup":
        return value ? "" : "Blood Group is required";
      case "altPhoneNumber":
        return value ? "" : "Alternate Phone Number is required";
      case "uhid":
        return value ? "" : "UHID is required";
      case "pastHistory":
        return value ? "" : "Past History is required";
      case "gender":
        return value ? "" : "Gender is required";
      default:
        return "";
    }
  };

  const handleDateChange = (dateName, date) => {
    setFormData({ ...formData, [dateName]: date });
    if (isSubmitted) {
      const errorMsg = validateField(dateName, date);
      setFormErrors((prev) => ({ ...prev, [dateName]: errorMsg }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    let isValid = true;
    const errors = {};
    Object.keys(formData).forEach((field) => {
      const errorMsg = validateField(field, formData[field]);
      if (errorMsg) {
        errors[field] = errorMsg;
        isValid = false;
      }
    });
    if (formData.dob) {
      const dobError = validateField("dob", formData.dob);
      if (dobError) {
        errors.dob = dobError;
        isValid = false;
      }
    }
    setFormErrors(errors);
    if (!isValid) {
      return;
    }
    var response = {};
    var message = "";
    try {
      if (formType === "Edit") {
        response = await axios.post(UPDATE_PATIENT, formData);
        message = "Updated the patient details";
      } else {
        response = await axios.put(
          `${UPDATE_PATIENT}?patientID=${formData.patientID}`,
          formData
        );
        message = "Created the patient successfully";
      }
      if (response) {
        toasterConfig("success", message);
      }
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      toasterConfig("error", "Something went wrong!");
    }
  };

  // const onSubmit = async (e, formState) => {
  //   e.preventDefault();
  //   setIsSubmitted(true);
  //   let isValid = true;
  //   const errors = {};
  //   Object.keys(formData).forEach((field) => {
  //     const errorMsg = validateField(field, formData[field]);
  //     if (errorMsg) {
  //       errors[field] = errorMsg;
  //       isValid = false;
  //     }
  //   });
  //   if (formData.dob) {
  //     const dobError = validateField("dob", formData.dob);
  //     if (dobError) {
  //       errors.dob = dobError;
  //       isValid = false;
  //     }
  //   }
  //   setFormErrors(errors);
  //   if (!isValid) {
  //     return;
  //   }

  //   try {
  //     if (formType === "Edit") {
  //       await axios.post(
  //         "https://agastya-hospitals-0bfo.onrender.com/api/patients",
  //         formData
  //       );
  //     } else {
  //       await axios.put(
  //         `https://agastya-hospitals-0bfo.onrender.com/api/patients?patientID=${formData.patientID}`,
  //         formData
  //       );
  //     }
  //     onClose();
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //   }
  // };

  return (
    <>
      <Breadcrumbs
        mainTitle={formType === "Edit" ? "Edit Patient" : "Add Patient"}
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
                  onSubmit={handleSubmit}
                >
                  <Row>
                    <Col md="4 mb-3">
                      <Label className="form-label" htmlFor="uhid">
                        UHID (Auto generated)
                      </Label>
                      <Input
                        type="text"
                        name="uhid"
                        id="uhid"
                        value={formData.uhid}
                        onChange={handleChange}
                        placeholder="Enter UHID"
                        invalid={!!formErrors.uhid}
                      />
                      <ValidationAlert error={formErrors.uhid} />
                    </Col>
                    <Col md="4 mb-3">
                      <Label className="form-label" htmlFor="fullName">
                        Full Name
                      </Label>
                      <Input
                        type="text"
                        name="fullName"
                        id="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter full name"
                        invalid={!!formErrors.fullName}
                      />
                      <ValidationAlert error={formErrors.fullName} />
                    </Col>
                    <Col md="4 mb-3">
                      <Label className="form-label" htmlFor="gender">
                        Gender
                      </Label>
                      <Input
                        type="select"
                        name="gender"
                        id="gender"
                        className="form-control digits"
                        invalid={!!formErrors.gender}
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="">Select gender</option>
                        {["Male", "Female", "Trans-gender"].map(
                          (gender, index) => (
                            <option key={index} value={gender}>
                              {gender}
                            </option>
                          )
                        )}
                      </Input>
                      <ValidationAlert error={formErrors.gender} />
                    </Col>
                    <Col md={4} className="">
                      <Label for="dob">Date of Birth</Label>

                      <InputGroup>
                        <DatePicker
                          className="form-control datetimepicker-input digits"
                          selected={formData.dob}
                          onChange={(date) => handleDateChange("dob", date)}
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

                      <ValidationAlert error={formErrors.dob} />
                    </Col>
                    <Col md="4 mb-3">
                      <Label className="form-label" htmlFor="bloodGroup">
                        Blood Group
                      </Label>
                      <Input
                        type="text"
                        name="bloodGroup"
                        id="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        placeholder="Enter blood group"
                        invalid={!!formErrors.bloodGroup}
                      />
                      <ValidationAlert error={formErrors.bloodGroup} />
                    </Col>
                    <Col md="4 mb-3">
                      <Label className="form-label" for="mobile">
                        Phone Number
                      </Label>
                      <Input
                        type="text"
                        name="mobile"
                        id="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        invalid={!!formErrors.mobile}
                      />
                      <ValidationAlert error={formErrors.mobile} />
                    </Col>
                    <Col md="4 mb-3">
                      <Label className="form-label" for="altPhoneNumber">
                        Alt Phone Number (Optional)
                      </Label>
                      <Input
                        type="text"
                        name="altPhoneNumber"
                        id="altPhoneNumber"
                        value={formData.altPhoneNumber}
                        onChange={handleChange}
                        placeholder="Enter alternate phone number"
                      />
                    </Col>
                    <Col md="4 mb-3">
                      <Label className="form-label" for="email">
                        Email Address (Optional)
                      </Label>
                      <Input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                      />
                    </Col>
                    <Col md="6 mb-3">
                      <Label className="form-label" for="address">
                        Address
                      </Label>
                      <Input
                        type="textarea"
                        name="address"
                        id="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter address"
                        invalid={!!formErrors.address}
                      />
                      <ValidationAlert error={formErrors.address} />
                    </Col>
                    <Col md="6 mb-3">
                      <Label className="form-label" for="pastHistory">
                        Past History (Optional)
                      </Label>
                      <Input
                        type="textarea"
                        name="pastHistory"
                        id="pastHistory"
                        value={formData.pastHistory}
                        onChange={handleChange}
                        placeholder="Enter any past medical history"
                      />
                    </Col>
                    <Col className="md-12 text-center mt-2">
                      <Button type="submit" color="primary">
                        Save
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

export default PatientForm;
