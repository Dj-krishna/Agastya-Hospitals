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
  InputGroupText,
  Label,
  Row,
} from "reactstrap";
import ValidationAlert from "../Common/Component/ValidationAlert";
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import { toasterConfig } from "../../utils";
import { createPatient, updatePatient } from "../../api/Services";
import { countryCodes } from "../../api/countryCode";

const initialFormData = {
  fullName: "",
  email: "",
  mobile: "",
  address: "",
  dob: new Date(),
  bloodGroup: "",
  altPhoneNumber: "",
  uhid: "",
  pastHistory: "",
  gender: "",
  profilePicture: "",
  countryCode: "+91",
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
  pastHistory: "",
  gender: "",
  profilePicture: "",
  countryCode: "+91",
};
const PatientForm = ({ onClose, formType, patientData }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("PatientForm useEffect - formType:", formType, "patientData:", patientData);
    if (formType === "Edit" && patientData) {
      setFormData({
        ...formData,
        ...patientData,
        uhid: patientData?.UHID || "",
        dob: patientData?.dob ? new Date(patientData.dob) : new Date(),
      });
    } else {
      setFormData(initialFormData);
    }
  }, [patientData, formType]);

  // Debug form data changes
  useEffect(() => {
    console.log("Form data updated:", formData);
  }, [formData]);

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
      case "gender":
        return value ? "" : "Gender is required";
      case "countryCode":
        return value ? "" : "Country Code is required";
      // Optional fields - no validation required
      case "bloodGroup":
      case "altPhoneNumber":
      case "uhid":
      case "pastHistory":
      case "email":
      case "profilePicture":
        return "";
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
    console.log("Form submitted with data:", formData);
    setIsSubmitted(true);
    setLoading(true);
    
    // Basic validation - only check if essential fields are filled
    if (!formData.fullName || !formData.mobile || !formData.address || !formData.gender) {
      console.log("Missing required fields");
      toasterConfig("error", "Please fill in all required fields");
      setLoading(false);
      return;
    }
    
    // Only validate required fields
    const requiredFields = ['fullName', 'mobile', 'address', 'dob', 'gender', 'countryCode'];
    let isValid = true;
    const errors = {};
    
    requiredFields.forEach((field) => {
      const errorMsg = validateField(field, formData[field]);
      if (errorMsg) {
        errors[field] = errorMsg;
        isValid = false;
      }
    });
    
    setFormErrors(errors);
    
    if (!isValid) {
      console.log("Form validation failed:", errors);
      setLoading(false);
      return;
    }

    try {
      // Prepare data according to API format
      const patientRequestData = {
        fullName: formData.fullName,
        dob: formData.dob instanceof Date ? formData.dob.toISOString().split('T')[0] : formData.dob,
        gender: formData.gender,
        email: formData.email || "",
        mobile: formData.mobile,
        address: formData.address,
        countryCode: formData.countryCode,
        bloodGroup: formData.bloodGroup || "",
        altMobile: formData.altPhoneNumber || "",
        pastHistory: formData.pastHistory || "",
        doctorID: formData.doctorID || 1, // Default doctor ID
        packageIDs: 2 // Static package ID as requested
      };

      console.log("Sending API request with data:", patientRequestData);
      console.log("Form type:", formType);

      let response;
      let message;

      if (formType === "Edit") {
        console.log("Updating patient with ID:", formData.patientID);
        response = await updatePatient(formData.patientID, patientRequestData);
        message = "Patient updated successfully";
      } else {
        console.log("Creating new patient");
        response = await createPatient(patientRequestData);
        message = "Patient created successfully";
      }

      console.log("API response:", response);

      if (response) {
        toasterConfig("success", message);
        onClose();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      
      // Handle specific error cases
      if (error.response?.data?.error?.includes("already exists")) {
        toasterConfig("error", "A patient with this country code and mobile number already exists.");
      } else if (error.response?.data?.message) {
        toasterConfig("error", error.response.data.message);
      } else {
        toasterConfig("error", "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
      setIsSubmitted(false);
    }
  };

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
                    {formType === "Edit" && (
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
                          // invalid={!!formErrors.uhid}
                          disabled={true}
                        />
                        <ValidationAlert error={formErrors.uhid} />
                      </Col>
                    )}
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
                          selected={new Date(formData.dob)}
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
                      <InputGroup
                        className={formErrors.mobile ? " is-invalid" : ""}
                      >
                        <Input
                          type="select"
                          name="countryCode"
                          value={formData.countryCode}
                          onChange={handleChange}
                          style={{ maxWidth: "100px" }}
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
                          id="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                          placeholder="Enter phone number"
                          invalid={!!formErrors.mobile}
                        />
                      </InputGroup>
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
                      <InputGroup>
                        <InputGroupText>{"@"}</InputGroupText>
                        <Input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter email address"
                        />
                      </InputGroup>
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
                    <Col className="col-md-12 text-center mt-2">
                      <Button 
                        type="submit" 
                        color="primary" 
                        disabled={loading}
                        onClick={() => console.log("Button clicked!")}
                      >
                        {loading ? "Processing..." : formType === "Edit" ? "Update Patient" : "Create Patient"}
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
