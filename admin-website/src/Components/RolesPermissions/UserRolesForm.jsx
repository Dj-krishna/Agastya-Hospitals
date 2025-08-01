import React, { useState } from "react";
import { Btn, H5 } from "../../AbstractElements";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row,
} from "reactstrap";
import ValidationAlert from "../Common/Component/ValidationAlert";
const initialFormState = {
  fullName: "",
  email: "",
  userName: "",
  password: "",
  loginType: "",
  selectedModules: "",
  userStatus: "Active",
};

const initialFormErrors = {
  fullName: "",
  email: "",
  userName: "",
  password: "",
  loginType: [],
  selectedModules: [],
  userStatus: "Active",
};
const UserRolesForm = () => {
  const [formState, setFormState] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        return value.trim() === "" ? "Full Name is required" : "";

      case "email":
        return /\S+@\S+\.\S+/.test(value) ? "" : "Valid Email is required";

      case "userName":
        return value === "" ? "User name is required" : "";
      case "password":
        return value === "" ? "Password is required" : "";
      case "loginType":
        return value === "" ? "Login type is required" : "";
      case "selectedModules":
        return value === "" ? "Please select a module" : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
    if (isSubmitted) {
      const errorMsg = validateField(name, value);
      setFormErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }
  };

  const handleRadioChange = (e) => {
    setFormState((prev) => ({
      ...prev,
      userStatus: e.target.value, // convert string to boolean
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const newformErrors = {};
    Object.keys(formState).forEach((key) => {
      newformErrors[key] = validateField(key, formState[key]);
    });

    setFormErrors(newformErrors);
    console.log("Form Errors:", newformErrors);

    const isValid = Object.values(newformErrors)
      .flat()
      .every((msg) => msg === "");
    if (isValid) {
      console.log("Form submitted successfully:", formState);
    } else {
      console.log("Validation failed");
    }
  };
  return (
    <Card>
      <CardHeader>
        <H5>Update User Roles</H5>
      </CardHeader>
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
              <Label className="form-label" for="userName">
                User Name
              </Label>
              <Input
                type="text"
                name="userName"
                id="userName"
                value={formState.userName}
                onChange={handleChange}
                placeholder="Enter user name"
                invalid={!!formErrors.userName}
              />
              <ValidationAlert error={formErrors.userName} />
            </Col>
            <Col md="4 mb-3">
              <Label className="form-label" for="password">
                Password
              </Label>
              <Input
                type="text"
                name="password"
                id="password"
                value={formState.password}
                onChange={handleChange}
                placeholder="Enter password"
                invalid={!!formErrors.password}
              />
              <ValidationAlert error={formErrors.password} />
            </Col>
            <Col md="4 mb-3">
              <Label className="form-label" for="loginType">
                Login Type
              </Label>
              <Input
                type="select"
                name="loginType"
                id="loginType"
                className="form-control digits"
                invalid={!!formErrors.loginType}
                value={formState.loginType}
                onChange={handleChange}
              >
                <option value="">Select login type</option>
                {["Admin", "Manager", "Receptionist"].map((role, index) => (
                  <option key={index + role} value={role}>
                    {role}
                  </option>
                ))}
              </Input>
              <ValidationAlert error={formErrors.loginType} />
            </Col>
            <Col md="4 mb-3">
              <Label className="form-label" for="selectedModules">
                Selected Modules
              </Label>
              <Input
                type="select"
                name="selectedModules"
                id="selectedModules"
                className="form-control digits"
                invalid={!!formErrors.selectedModules}
                value={formState.selectedModules}
                onChange={handleChange}
              >
                <option value="">Select a module</option>
                {["Dashboard", "Appointments"].map((module, index) => (
                  <option key={index + module} value={module}>
                    {module}
                  </option>
                ))}
              </Input>
              <ValidationAlert error={formErrors.selectedModules} />
            </Col>
            <Col md="12 my-3">
              <FormGroup tag="fieldset">
                <Row className="align-items-center">
                  <Col sm="auto">
                    <Label className="form-label">User Status</Label>
                  </Col>
                  <Col sm="auto" className="mt-1">
                    <FormGroup check inline>
                      <Input
                        type="radio"
                        name="userStatus"
                        id="userStatusActive"
                        value="Active"
                        checked={formState.userStatus === "Active"}
                        onChange={handleRadioChange}
                      />{" "}
                      <Label check for="userStatusActive">
                        Active
                      </Label>
                    </FormGroup>
                    <FormGroup check inline>
                      <Input
                        type="radio"
                        name="userStatus"
                        id="userStatusInactive"
                        value="Inactive"
                        checked={formState.userStatus === "Inactive"}
                        onChange={handleRadioChange}
                      />{" "}
                      <Label check for="userStatusInactive">
                        Inactive
                      </Label>
                    </FormGroup>
                  </Col>
                </Row>
              </FormGroup>
            </Col>
          </Row>
          <Btn attrBtn={{ color: "primary" }}>{"Submit"}</Btn>
        </Form>
      </CardBody>
    </Card>
  );
};

export default UserRolesForm;
