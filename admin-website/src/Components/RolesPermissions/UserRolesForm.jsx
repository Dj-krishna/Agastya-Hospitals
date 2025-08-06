import React, { useState, useEffect, useRef } from "react";
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
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap";
import ValidationAlert from "../Common/Component/ValidationAlert";
import { fetchLoginTypes, fetchModules } from "../../api/Services";

// Custom CSS for better checkbox visibility
const checkboxStyles = `
  .custom-checkbox {
    border: 2px solid #333 !important;
    border-radius: 4px !important;
    width: 18px !important;
    height: 18px !important;
    accent-color: #007bff !important;
    background-color: white !important;
    appearance: auto !important;
    -webkit-appearance: auto !important;
    -moz-appearance: auto !important;
    cursor: pointer !important;
    position: relative !important;
    margin-right: 8px !important;
    flex-shrink: 0 !important;
  }
  
  .custom-checkbox:checked {
    background-color: #007bff !important;
    border-color: #007bff !important;
  }
  
  .custom-checkbox:hover {
    border-color: #0056b3 !important;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25) !important;
  }
  
  .custom-checkbox:focus {
    outline: none !important;
    border-color: #007bff !important;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25) !important;
  }
  
  .dropdown-item:hover .custom-checkbox {
    border-color: #0056b3 !important;
  }
`;

const initialFormState = {
  fullName: "",
  email: "",
  userName: "",
  password: "",
  loginType: "",
  selectedModules: [],
  userStatus: "Active",
};

const initialFormErrors = {
  fullName: "",
  email: "",
  userName: "",
  password: "",
  loginType: "",
  selectedModules: "",
  userStatus: "",
};

const UserRolesForm = () => {
  const [formState, setFormState] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loginTypes, setLoginTypes] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moduleDropdownOpen, setModuleDropdownOpen] = useState(false);

  // Fetch login types and modules on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching login types and modules...");
        const [loginTypesData, modulesData] = await Promise.all([
          fetchLoginTypes(),
          fetchModules(),
        ]);
        console.log("Login Types:", loginTypesData);
        console.log("Modules:", modulesData);
        setLoginTypes(loginTypesData);
        setModules(modulesData);
      } catch (error) {
        console.error("Error fetching form data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Inject custom CSS for checkboxes
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = checkboxStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

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
        return Array.isArray(value) && value.length === 0
          ? "Please select at least one module"
          : "";
      case "userStatus":
        return value === "" ? "User status is required" : "";
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

  const handleModuleChange = (moduleId, moduleName, checked) => {
    setFormState((prev) => {
      const updatedModules = checked
        ? [...prev.selectedModules, moduleName]
        : prev.selectedModules.filter((module) => module !== moduleName);

      return {
        ...prev,
        selectedModules: updatedModules,
      };
    });

    if (isSubmitted) {
      const updatedModules = formState.selectedModules;
      if (checked) {
        updatedModules.push(moduleName);
      } else {
        const index = updatedModules.indexOf(moduleName);
        if (index > -1) {
          updatedModules.splice(index, 1);
        }
      }
      const errorMsg = validateField("selectedModules", updatedModules);
      setFormErrors((prev) => ({ ...prev, selectedModules: errorMsg }));
    }
  };

  const handleSelectAllModules = () => {
    const allModuleNames = modules.map((module) => module.moduleName);
    setFormState((prev) => ({
      ...prev,
      selectedModules: allModuleNames,
    }));
    if (isSubmitted) {
      const errorMsg = validateField("selectedModules", allModuleNames);
      setFormErrors((prev) => ({ ...prev, selectedModules: errorMsg }));
    }
  };

  const handleClearAllModules = () => {
    setFormState((prev) => ({
      ...prev,
      selectedModules: [],
    }));
    if (isSubmitted) {
      const errorMsg = validateField("selectedModules", []);
      setFormErrors((prev) => ({ ...prev, selectedModules: errorMsg }));
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

    const isValid = Object.values(newformErrors).every((msg) => msg === "");
    if (isValid) {
      console.log("Form submitted successfully:", formState);
      console.log("Selected Login Type:", formState.loginType);
      console.log("Selected Modules:", formState.selectedModules);
      console.log("User Status:", formState.userStatus);
    } else {
      console.log("Validation failed");
    }
  };

  const toggleModuleDropdown = () => {
    setModuleDropdownOpen(!moduleDropdownOpen);
  };

  const getDropdownText = () => {
    if (formState.selectedModules.length === 0) {
      return "Select modules";
    } else if (formState.selectedModules.length === 1) {
      return formState.selectedModules[0];
    } else {
      return `${formState.selectedModules.length} modules selected`;
    }
  };

  const removeModule = (moduleName) => {
    setFormState((prev) => ({
      ...prev,
      selectedModules: prev.selectedModules.filter(
        (module) => module !== moduleName
      ),
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <H5>Update User Roles</H5>
        </CardHeader>
        <CardBody>
          <div className="text-center p-4">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-2">Loading form data...</p>
          </div>
        </CardBody>
      </Card>
    );
  }

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
                {loginTypes.map((loginType) => (
                  <option key={loginType.roleID} value={loginType.roleName}>
                    {loginType.roleName}
                  </option>
                ))}
              </Input>
              <ValidationAlert error={formErrors.loginType} />
            </Col>
            <Col md="4 mb-3"></Col>
            <Col md="4 mb-3">
              <Label className="form-label">Select Modules</Label>
              <Dropdown
                isOpen={moduleDropdownOpen}
                toggle={toggleModuleDropdown}
              >
                <DropdownToggle
                  caret
                  className="w-100 text-start d-flex justify-content-between align-items-center"
                  style={{
                    textAlign: "left",
                    backgroundColor: "white",
                    border: formErrors.selectedModules
                      ? "1px solid #dc3545"
                      : "1px solid #ced4da",
                    borderRadius: "0.375rem",
                    padding: "0.375rem 0.75rem",
                    minHeight: "38px",
                    fontSize: "0.875rem",
                  }}
                >
                  <span
                    className={
                      formState.selectedModules.length === 0 ? "text-muted" : ""
                    }
                  >
                    {getDropdownText()}
                  </span>
                  {/* <span className="text-muted">▼</span> */}
                </DropdownToggle>
                <DropdownMenu
                  className="w-100"
                  style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    minWidth: "300px",
                  }}
                >
                  <div className="px-3 py-1 border-bottom bg-light">
                    <div className="">
                      <small className="text-muted fw-bold">
                        Select Modules
                      </small>
                      <div>
                        <Btn
                          attrBtn={{
                            color: "outline-primary",
                            size: "sm",
                            onClick: handleSelectAllModules,
                            className: "me-1 py-1 px-3",
                          }}
                        >
                          All
                        </Btn>
                        <Btn
                          attrBtn={{
                            color: "outline-secondary",
                            size: "sm",
                            onClick: handleClearAllModules,
                            className: "me-1 py-1 px-3",
                          }}
                        >
                          Clear
                        </Btn>
                      </div>
                    </div>
                  </div>
                  {modules.map((module, index) => (
                    <DropdownItem
                      key={module.moduleID + index}
                      className="p-2 border-bottom"
                    >
                      <div className="d-flex align-items-start">
                        <Input
                          type="checkbox"
                          id={`module-${module.moduleID}-${index}`}
                          checked={formState.selectedModules.includes(
                            module.moduleName
                          )}
                          onChange={(e) =>
                            handleModuleChange(
                              module.moduleID,
                              module.moduleName,
                              e.target.checked
                            )
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="custom-checkbox mt-1"
                        />
                        <Label
                          check
                          for={`module-${module.moduleID}-${index}`}
                          className="mb-0 flex-grow-1 ms-2"
                        >
                          <div>
                            <div className="fw-semibold">
                              {module.moduleName}
                            </div>
                            <small className="text-muted">
                              {module.description}
                            </small>
                          </div>
                        </Label>
                      </div>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              <ValidationAlert error={formErrors.selectedModules} />
            </Col>
            <Col md={8}>
              {formState.selectedModules.length > 0 && (
                <div className="">
                  <Label className="d-block mb-1">Selected modules:</Label>
                  <div className="d-flex flex-wrap gap-1">
                    {formState.selectedModules.map((moduleName, index) => (
                      <span
                        key={index}
                        className="badge bg-primary d-flex align-items-center"
                        style={{ fontSize: "0.75rem" }}
                      >
                        {moduleName}
                        <button
                          type="button"
                          className="btn-close btn-close-white ms-1"
                          style={{ fontSize: "0.5rem" }}
                          onClick={() => removeModule(moduleName)}
                          aria-label="Remove module"
                        />
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
