import React, { useState } from "react";
import { Breadcrumbs } from "../../AbstractElements";
import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Input,
  Label,
  Row,
} from "reactstrap";
import ValidationAlert from "../Common/Component/ValidationAlert";

const initialFormData = {
  fullName: "",
  emailId: "",
  phoneNumber: "",
  address: "",
  dateOfBirth: "",
};
const initialFormErrors = {
  fullName: "",
  emailId: "",
  phoneNumber: "",
  address: "",
  dateOfBirth: "",
};
const PatientForm = ({ onClose, isEditMode }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" }); // Clear error on change
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    let isValid = true;
    const errors = { ...initialFormErrors };
    if (!formData.fullName) {
      errors.fullName = "Full Name is required";
      isValid = false;
    }
    if (!formData.emailId) {
      errors.emailId = "Email ID is required";
      isValid = false;
    }
    if (!formData.phoneNumber) {
      errors.phoneNumber = "Phone Number is required";
      isValid = false;
    }
    if (!formData.address) {
      errors.address = "Address is required";
      isValid = false;
    }
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = "Date of Birth is required";
      isValid = false;
    }
    setFormErrors(errors);
    if (isValid) {
      console.log("Form submitted successfully with data:", formData);
      setIsSubmitted(false);
      // Here you can handle the form submission, e.g., send data to an API
    } else {
      console.error("Form validation failed:", errors);
    }
  };

  const onSubmit = (e, formState) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted with data:", formState);
    onClose(); // Close the form after submission
  };

  return (
    <>
      <Breadcrumbs
        mainTitle={isEditMode ? "Edit Patient" : "Add Patient"}
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
                  onSubmit={(e) => onSubmit(e, formData)}
                >
                  <Row>
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
