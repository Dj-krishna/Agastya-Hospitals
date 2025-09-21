import React, { useEffect, useState } from "react";
import { Breadcrumbs } from "../../AbstractElements";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  DropdownItem,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import ValidationAlert from "../Common/Component/ValidationAlert";
import HTMLTextEditor from "../Common/Component/HTMLTextEditor";
import MultiSelect from "../Common/Component/MultiSelect";
import ModelComponent from "../Common/Component/ModelComponent";

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
  packageName: "",
  price: "",
  discountType: "fixedPrice",
  discountAmount: "",
  image: "",
  testsQuantity: "",
  listOfCoveredTests: "",
  idealFor: [],
  idealForIds: [],
  ageGroup: "",
  descriptionOfPackage: "",
  guidelines: "",
};
const initialFormErrors = {
  packageName: "",
  price: "",
  discountType: "fixedPrice",
  discountAmount: "",
  image: "",
  testsQuantity: "",
  listOfCoveredTests: "",
  idealFor: [],
  idealForIds: [],
  ageGroup: "",
  descriptionOfPackage: "",
  guidelines: "",
};

const initialModalData = {
  fullName: "",
  emailId: "",
  phoneNumber: "",
};
const initialModalErrors = {
  fullName: "",
  emailId: "",
  phoneNumber: "",
};

const HealthPackagesForm = ({ onClose }) => {
  const [formState, setFormState] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isIdealForOpen, setIsIdealForOpen] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [modalErrors, setModalErrors] = useState(initialModalErrors);
  const [modalData, setModalData] = useState(initialModalData);
  const [isModalSubmitted, setIsModalSubmitted] = useState(false);

  const idealForList = [
    { name: "Male", id: 1 },
    { name: "Female", id: 2 },
    { name: "Children", id: 3 },
  ];

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = checkboxStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const validateField = (field, value) => {
    switch (field) {
      case "packageName":
        return value === "" ? "Package name is required" : "";
      case "price":
        if (!value.trim()) return "Price is required";
        if (!/^\d+$/.test(value)) return "Price must contain digits only";
        return "";
      case "discountType":
        return value === "" ? "Discount type is required" : "";
      case "image":
        return value === "" ? "Please upload image" : "";
      case "testsQuantity":
        if (!value.trim()) return "No. of lab tests is required";
        if (!/^[1-9]\d*$/.test(value))
          return "Tests quantity must be a positive number";
        return "";

      case "discountAmount":
        if (!value.trim()) return "Discount amount is required";
        if (!/^\d+$/.test(value))
          return "Discount amount must contain digits only";
        return "";
      case "listOfCoveredTests":
        return value === "" ? "List of covered tests are required" : "";
      case "idealFor":
        return Array.isArray(value) && value.length === 0
          ? "Please select at least one module"
          : "";
      case "ageGroup":
        if (!value.trim()) return "Age group is required";
        if (!/^\d{1,3}\s?-\s?\d{1,3}$/.test(value))
          return "Age group must be in the format 'X - Y'";
        return "";
      case "descriptionOfPackage":
        return value === "" ? "Description of health packages is required" : "";
      case "guidelines":
        return value === "" ? "Guidelines are required" : "";
      case "fullName":
        return value === "" ? "Full name is required" : "";
      case "emailId":
        if (!value.trim()) return "Email address is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Invalid email format";
        return "";

      case "phoneNumber":
        if (!value.trim()) return "Phone number is required";
        if (!/^\+?[0-9]{10,15}$/.test(value))
          return "Phone number must be 10-15 digits, with optional + at the start";
        return "";
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
  };

  const validateQuillField = (fieldName, value) => {
    const stripped = value.editor
      .getData()
      .replace(/<[^>]+>/g, "")
      .trim();
    return stripped === "" ? "This field is required" : "";
  };

  const handleQuillChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value.editor.getData() }));
    if (isSubmitted) {
      const errMsg = validateQuillField(field, value);
      setFormErrors((prev) => ({ ...prev, [field]: errMsg }));
    }
  };

  const handleQuillBlur = (field) => {
    // const errMsg = validateQuillField(field, formState[field]);
    // setFormErrors((prev) => ({ ...prev, [field]: errMsg }));
  };

  const handleSubmit = (e, data) => {
    e.preventDefault();
    setIsSubmitted(true);

    const newErrors = {};
    Object.keys(formState).forEach((key) => {
      if (
        formState[key] === "listOfCoveredTests" ||
        formState[key] === "descriptionOfPackage" ||
        formState[key] === "guidelines"
      ) {
        newErrors[key] = validateQuillField(key, formState[key]);
      } else {
        newErrors[key] = validateField(key, formState[key]);
      }
    });
    setFormErrors(newErrors);
    const isValid =
      Object.values(newErrors)
        .flat()
        .every((msg) => msg === "") &&
      Object.values(data).every((value) => value !== "");
    const isHTMLValid = Object.values(formState).every((value) => {
      if (typeof value === "string") {
        const stripped = value.replace(/<[^>]+>/g, "").trim();
        return stripped !== "";
      }
      return true;
    });

    if (isValid && isHTMLValid) {
      console.log("Form submitted successfully with data:", formState);
      setOpenPreview(true);
      setIsSubmitted(false);
      // Here you can handle the form submission, e.g., send data to an API
    } else {
      console.log("Form has errors:", newErrors);
      console.log("Form errors with data:", formState);
    }
  };
  const handleRadioChange = (e) => {
    setFormState((prev) => ({
      ...prev,
      discountType: e.target.value, // convert string to boolean
    }));
  };

  const getDropdownText = () => {
    if (formState.idealFor.length === 0) {
      return "Select ideal for";
    } else if (formState.idealFor.length === 1) {
      return formState.idealFor[0];
    } else {
      return `${formState.idealFor.length} selected`;
    }
  };

  const handleClearAllModules = () => {
    setFormState((prev) => ({
      ...prev,
      idealFor: [],
      idealForIds: [],
    }));
    if (isSubmitted) {
      const errorMsg = validateField("idealFor", []);
      setFormErrors((prev) => ({ ...prev, idealFor: errorMsg }));
    }
  };

  const handleSelectAllModules = () => {
    const allModuleNames = idealForList.map((ideal) => ideal.name);
    const allModuleIds = idealForList.map((ideal) => ideal.id);
    setFormState((prev) => ({
      ...prev,
      idealFor: allModuleNames,
      idealForIds: allModuleIds,
    }));
    if (isSubmitted) {
      const errorMsg = validateField("idealFor", allModuleNames);
      setFormErrors((prev) => ({ ...prev, idealFor: errorMsg }));
    }
  };

  const handleModuleChange = (idealId, idealName, checked) => {
    setFormState((prev) => {
      const updatedModules = checked
        ? [...prev.idealFor, idealName]
        : prev.idealFor.filter((ideal) => ideal !== idealName);

      const updatedModuleIds = checked
        ? [...prev.idealForIds, idealId]
        : prev.idealForIds.filter((id) => id !== idealId);

      return {
        ...prev,
        idealFor: updatedModules,
        idealForIds: updatedModuleIds,
      };
    });

    if (isSubmitted) {
      const updatedModules = formState.idealFor;
      const updatedModuleIds = formState.idealForIds;
      if (checked) {
        updatedModules.push(idealName);
        updatedModuleIds.push(idealId);
      } else {
        const index = updatedModules.indexOf(idealName);
        if (index > -1) {
          updatedModules.splice(index, 1);
        }
        const idIndex = updatedModuleIds.indexOf(idealId);
        if (idIndex > -1) {
          updatedModuleIds.splice(idIndex, 1);
        }
      }
      const errorMsg = validateField("idealFor", updatedModules);
      setFormErrors((prev) => ({ ...prev, idealFor: errorMsg }));
    }
  };

  const removeModule = (idealForName) => {
    setFormState((prev) => {
      // Find the module ID for the given module name
      const module = idealForList.find((m) => m.name === idealForName);
      const moduleId = module ? module.id : null;

      return {
        ...prev,
        idealFor: prev.idealFor.filter((module) => module !== idealForName),
        idealForIds: prev.idealForIds.filter((id) => id !== moduleId),
      };
    });
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setModalData((prev) => ({ ...prev, [name]: value }));
    if (isSubmitted) {
      const errorMsg = validateField(name, value);
      setModalErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    setIsModalSubmitted(true);
    const newErrors = {};
    Object.keys(modalData).forEach((key) => {
      newErrors[key] = validateField(key, modalData[key]);
    });
    setModalErrors(newErrors);
    const isValid =
      Object.values(newErrors)
        .flat()
        .every((msg) => msg === "") &&
      Object.values(modalData).every((value) => value !== "");
    if (isValid) {
      console.log("Modal form submitted successfully with data:", modalData);
      setOpenPreview(false);
      setModalData(initialModalData);
      setIsModalSubmitted(false);
      // Here you can handle the modal form submission, e.g., send data to an API
    } else {
      console.log("Modal form has errors:", newErrors);
      console.log("Modal form errors with data:", modalData);
    }
  };

  return (
    <>
      <Breadcrumbs
        mainTitle="Health Packages"
        btnColor={"secondary"}
        buttonTitle={"Cancel"}
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
                  onSubmit={(e) => handleSubmit(e, formState)}
                >
                  <Row>
                    <Col md="4 mb-3">
                      <Label className="form-label" for="packageName">
                        Package name
                      </Label>
                      <Input
                        type="text"
                        name="packageName"
                        id="packageName"
                        value={formState.packageName}
                        onChange={handleChange}
                        placeholder="Enter package name"
                        invalid={!!formErrors.packageName}
                      />
                      <ValidationAlert error={formErrors.packageName} />
                    </Col>
                    <Col md="4 mb-3">
                      <Label className="form-label" for="price">
                        Price
                      </Label>
                      <Input
                        type="text"
                        name="price"
                        id="price"
                        value={formState.price}
                        onChange={handleChange}
                        placeholder="Enter price"
                        invalid={!!formErrors.price}
                      />
                      <ValidationAlert error={formErrors.price} />
                    </Col>
                    <Col md={4} className="mb-3">
                      <Label className="form-label">User Status</Label>
                      <Row className="align-items-center">
                        <Col sm="auto" className="mt-1">
                          <FormGroup
                            check
                            inline
                            className="radio radio-primary"
                          >
                            <Input
                              type="radio"
                              name="discountType"
                              id="discountTypeFixed"
                              value="fixedPrice"
                              checked={formState.discountType === "fixedPrice"}
                              onChange={handleRadioChange}
                            />{" "}
                            <Label check for="discountTypeFixed">
                              Fixed Price
                            </Label>
                          </FormGroup>
                          <FormGroup
                            check
                            inline
                            className="radio radio-primary"
                          >
                            <Input
                              type="radio"
                              name="discountType"
                              id="discountType%"
                              value="percentage"
                              checked={formState.discountType === "percentage"}
                              onChange={handleRadioChange}
                            />{" "}
                            <Label check for="discountType%">
                              Percentage(%)
                            </Label>
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>
                    <Col md="4 mb-3">
                      <Label className="form-label" for="discountAmount">
                        Discount Amount
                      </Label>
                      <Input
                        type="text"
                        name="discountAmount"
                        id="discountAmount"
                        value={formState.discountAmount}
                        onChange={handleChange}
                        placeholder="Enter discount amount"
                        invalid={!!formErrors.discountAmount}
                      />
                      <ValidationAlert error={formErrors.discountAmount} />
                    </Col>
                    <Col md="4 mb-3">
                      <Label className="form-label" for="image">
                        Photo
                      </Label>
                      <Input
                        type="file"
                        name="image"
                        id="image"
                        onChange={handleChange}
                        // placeholder="Enter profile photo"
                        invalid={!!formErrors.image}
                      />
                      <ValidationAlert error={formErrors.image} />
                    </Col>
                    <Col md="4 mb-3">
                      <Label className="form-label" for="testsQuantity">
                        No. of Lab tests
                      </Label>
                      <Input
                        type="text"
                        name="testsQuantity"
                        id="testsQuantity"
                        value={formState.testsQuantity}
                        onChange={handleChange}
                        placeholder="Enter No. of Lab tests"
                        invalid={!!formErrors.testsQuantity}
                      />
                      <ValidationAlert error={formErrors.testsQuantity} />
                    </Col>
                    <Col md="12 mb-3">
                      <Label className="form-label" for="listOfCoveredTests">
                        List of Covered Tests
                      </Label>
                      <HTMLTextEditor
                        name="listOfCoveredTests"
                        state={formState.listOfCoveredTests}
                        handleChange={(value) =>
                          handleQuillChange("listOfCoveredTests", value)
                        }
                        placeholder="Enter list of covered tests separated by comma(,)"
                        onBlur={() => handleQuillBlur("listOfCoveredTests")}
                        errors={
                          formErrors.listOfCoveredTests && (
                            <div className="text-danger">
                              {formErrors.listOfCoveredTests}
                            </div>
                          )
                        }
                      />
                    </Col>
                    <Col md={4} className="mb-3">
                      <Label className="form-label">Age Group</Label>
                      <Input
                        type="text"
                        name="ageGroup"
                        id="ageGroup"
                        value={formState.ageGroup}
                        onChange={handleChange}
                        placeholder="Enter age group"
                        invalid={!!formErrors.ageGroup}
                      />
                      <ValidationAlert error={formErrors.ageGroup} />
                    </Col>
                    <Col md="8 mb-3">
                      <Row>
                        <Col md={6}>
                          <Label className="form-label">Ideal For</Label>
                          <MultiSelect
                            isOpen={isIdealForOpen}
                            toggle={() => setIsIdealForOpen(!isIdealForOpen)}
                            errorStates={formErrors.idealFor}
                            formStates={formState.idealFor}
                            getDropdownText={getDropdownText}
                            handleClearAll={handleClearAllModules}
                            handleSelectAll={handleSelectAllModules}
                            items={idealForList.map((ideal) => (
                              <DropdownItem
                                key={ideal.id}
                                className="p-2 border-bottom"
                              >
                                <div className="d-flex align-items-start">
                                  <Input
                                    type="checkbox"
                                    id={`module-${ideal.id}`}
                                    checked={formState.idealForIds.includes(
                                      ideal.id
                                    )}
                                    onChange={(e) =>
                                      handleModuleChange(
                                        ideal.id,
                                        ideal.name,
                                        e.target.checked
                                      )
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                    className="custom-checkbox mt-1"
                                  />
                                  <Label
                                    check
                                    for={`module-${ideal.id}`}
                                    className="mb-0 flex-grow-1 ms-2"
                                  >
                                    <div>
                                      <div className="fw-semibold">
                                        {ideal.name}
                                      </div>
                                    </div>
                                  </Label>
                                </div>
                              </DropdownItem>
                            ))}
                          />
                        </Col>
                        <Col md={6}>
                          {formState.idealFor.length > 0 && (
                            <div className="">
                              <Label className="d-block mb-1">
                                Selected list:
                              </Label>
                              <div className="d-flex flex-wrap gap-1">
                                {formState.idealFor.map((ideal, index) => (
                                  <span
                                    key={index}
                                    className="badge bg-primary d-flex align-items-center"
                                    style={{ fontSize: "0.75rem" }}
                                  >
                                    {ideal}
                                    <button
                                      type="button"
                                      className="btn-close btn-close-white ms-1"
                                      style={{ fontSize: "0.5rem" }}
                                      onClick={() => removeModule(ideal)}
                                      aria-label="Remove module"
                                    />
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </Col>
                      </Row>
                    </Col>
                    <Col md="12 mb-3">
                      <Label className="form-label">
                        Description of Health package
                      </Label>
                      <HTMLTextEditor
                        name="descriptionOfPackage"
                        state={formState.descriptionOfPackage}
                        handleChange={(value) =>
                          handleQuillChange("descriptionOfPackage", value)
                        }
                        placeholder="Enter description of health package"
                        onBlur={() => handleQuillBlur("descriptionOfPackage")}
                        errors={
                          formErrors.descriptionOfPackage && (
                            <div className="text-danger">
                              {formErrors.descriptionOfPackage}
                            </div>
                          )
                        }
                      />
                    </Col>
                    <Col md="12 mb-3">
                      <Label className="form-label">Guidelines</Label>
                      <HTMLTextEditor
                        name="guidelines"
                        state={formState.guidelines}
                        handleChange={(value) =>
                          handleQuillChange("guidelines", value)
                        }
                        placeholder="Enter guidelines for the health package"
                        onBlur={() => handleQuillBlur("guidelines")}
                        errors={
                          formErrors.guidelines && (
                            <div className="text-danger">
                              {formErrors.guidelines}
                            </div>
                          )
                        }
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Button type="submit" color="primary">
                        Proceed to Buy
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <ModelComponent
        children={
          <Form
            className="needs-validation"
            noValidate=""
            onSubmit={(e) => handleModalSubmit(e, modalData)}
          >
            <Row>
              <Col md="md-12 mb-3">
                <Label className="form-label" for="fullName">
                  Full Name
                </Label>
                <Input
                  type="text"
                  name="fullName"
                  id="fullName"
                  value={modalData.fullName}
                  onChange={handleModalChange}
                  placeholder="Enter full name"
                  invalid={!!modalErrors.fullName}
                />
                <ValidationAlert error={modalErrors.fullName} />
              </Col>
              <Col md="md-12 mb-3">
                <Label className="form-label" for="emailId">
                  Email Address
                </Label>
                <Input
                  type="email"
                  name="emailId"
                  id="emailId"
                  value={modalData.emailId}
                  onChange={handleModalChange}
                  placeholder="Enter email address"
                  invalid={!!modalErrors.emailId}
                />
                <ValidationAlert error={modalErrors.emailId} />
              </Col>
              <Col md="md-12 mb-3">
                <Label className="form-label" for="phoneNumber">
                  Phone Number
                </Label>
                <Input
                  type="text"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={modalData.phoneNumber}
                  onChange={handleModalChange}
                  placeholder="Enter phone number"
                  invalid={!!modalErrors.phoneNumber}
                />
                <ValidationAlert error={modalErrors.phoneNumber} />
              </Col>
              <Col className="text-center">
                <Button type="submit" color="primary">
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        }
        isOpen={openPreview}
        toggler={() => setOpenPreview(!openPreview)}
        title={"Preview Health Package"}
      />
    </>
  );
};

export default HealthPackagesForm;
