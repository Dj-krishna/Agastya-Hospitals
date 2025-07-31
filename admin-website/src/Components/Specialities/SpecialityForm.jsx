import React, { Fragment, useState } from "react";
import { Breadcrumbs, Btn } from "../../AbstractElements";
import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import ValidationAlert from "../Common/Component/ValidationAlert";
import HTMLTextEditor from "../Common/Component/HTMLTextEditor";

const initialFormState = {
  name: "",
  icon: "",
  displayOrder: "",
  assignDoctor: "",
  shortDescription: "",
  pageDescription: "",
  pageBanner: "",
  seoKeyWords: "",
  urlSlug: "",
  displayInNavMenu: "Yes",
  temporaryDeactive: false,
};

const initialFormErrors = {
  name: "",
  icon: "",
  displayOrder: "",
  assignDoctor: "",
  shortDescription: "",
  pageDescription: "",
  pageBanner: "",
  seoKeyWords: "",
  //urlSlug: "",
  displayInNavMenu: "",
  temporaryDeactive: "",
};

const SpecialityForm = ({ onClose }) => {
  const [formState, setFormState] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [isSubmitted, setIsSubmitted] = useState(false);

  console.log("formState", formState);

  const validateAllFields = (name, value) => {
    const isEmpty = (val) =>
      typeof val === "string" ? val.trim() === "" : !val;

    const requiredFields = {
      name: "Name is required",
      icon: "Icon is required",
      displayOrder: "Display Order(in Home page) is required",
      assignDoctor: "Assign Doctor is required",
      shortDescription: "Short description is required",
      pageDescription: "Page description is required",
      pageBanner: "Page banner is required",
      seoKeyWords: "SEO Keywords are required",
      //urlSlug: "Languages are required",
      displayInNavMenu: "This is required",
      temporaryDeactive: "Temporary deactive is required",
    };

    if (requiredFields[name]) {
      return isEmpty(value) ? requiredFields[name] : "";
    }

    return "";
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: type === "file" ? files[0] : value,
    }));
    if (isSubmitted) {
      const error = validateAllFields(name, type === "file" ? files[0] : value);
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));
    }
  };

  const handleRadioChange = (e) => {
    setFormState((prev) => ({
      ...prev,
      displayInNavMenu: e.target.value, // convert string to boolean
    }));
  };

  const validateQuillField = (fieldName, value) => {
    const stripped = value.replace(/<[^>]+>/g, "").trim();
    return stripped === "" ? "This field is required" : "";
  };

  const handleQuillChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (isSubmitted) {
      const errMsg = validateQuillField(field, value);
      setFormErrors((prev) => ({ ...prev, [field]: errMsg }));
    }
  };

  const handleQuillBlur = (field) => {
    const errMsg = validateQuillField(field, formState[field]);
    setFormErrors((prev) => ({ ...prev, [field]: errMsg }));
  };

  const onSubmit = (e, data) => {
    e.preventDefault();
    setIsSubmitted(true);
    const newErrors = {};
    Object.keys(formState).forEach((key) => {
      const error = validateAllFields(key, formState[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted successfully with data:", formState);
      // Here you can handle the form submission, e.g., send data to an API
      onClose(); // Close the form after submission
    } else {
      console.log("Form has errors:", newErrors);
    }
  };
  return (
    <>
      <Breadcrumbs
        mainTitle="Add Speciality"
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
                  onSubmit={(e) => onSubmit(e)}
                >
                  <Row>
                    <Col md="6 mb-3">
                      <Label className="form-label" for="name">
                        Name
                      </Label>
                      <Input
                        type="text"
                        name="name"
                        id="name"
                        value={formState.name}
                        onChange={handleChange}
                        placeholder="Enter name"
                        invalid={!!formErrors.name}
                      />
                      <ValidationAlert error={formErrors.name} />
                    </Col>
                    <Col md="6 mb-3">
                      <Label className="form-label" for="icon">
                        Icon
                      </Label>
                      <Input
                        type="file"
                        name="icon"
                        id="icon"
                        onChange={handleChange}
                        placeholder="Enter icon"
                        invalid={!!formErrors.icon}
                      />
                      <ValidationAlert error={formErrors.icon} />
                    </Col>
                    <Col md="6 mb-3">
                      <Label className="form-label" for="displayOrder">
                        Display Order (in Home page)
                      </Label>
                      <Input
                        type="text"
                        name="displayOrder"
                        value={formState.displayOrder}
                        onChange={handleChange}
                        placeholder="Enter display order in Home page"
                        invalid={!!formErrors.displayOrder}
                      />
                      <ValidationAlert error={formErrors.displayOrder} />
                    </Col>
                    <Col md="6 mb-3">
                      <Label className="form-label" for="assignDoctor">
                        Assign Doctor
                      </Label>
                      <Input
                        type="select"
                        name="assignDoctor"
                        id="assignDoctor"
                        className="form-control digits"
                        value={formState.assignDoctor}
                        onChange={handleChange}
                        invalid={!!formErrors.assignDoctor}
                      >
                        <option value="">Select doctor</option>
                        {[0, 1, 2, 3, 4, 5].map((doctor, index) => (
                          <option key={index + doctor} value={doctor}>
                            {doctor}
                          </option>
                        ))}
                      </Input>
                      <ValidationAlert error={formErrors.assignDoctor} />
                    </Col>
                    <Col md="12 mb-3">
                      <Label className="form-label" for="shortDescription">
                        Short Description on the Card of home page carousel
                      </Label>
                      <Input
                        type="textarea"
                        name="shortDescription"
                        value={formState.shortDescription}
                        onChange={handleChange}
                        placeholder="Enter short description"
                        invalid={!!formErrors.shortDescription}
                      />
                      <ValidationAlert error={formErrors.shortDescription} />
                    </Col>
                    <Col md="12 mb-3">
                      <Label className="form-label" for="pageDescription">
                        Page Description
                      </Label>
                      <HTMLTextEditor
                        name="pageDescription"
                        state={formState.pageDescription}
                        handleChange={(value) =>
                          handleQuillChange("pageDescription", value)
                        }
                        placeholder="Enter areas of Page Description"
                        onBlur={() => handleQuillBlur("pageDescription")}
                        errors={
                          formErrors.pageDescription && (
                            <div className="text-danger">
                              {formErrors.pageDescription}
                            </div>
                          )
                        }
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md="6 mb-3">
                      <Label className="form-label" for="pageBanner">
                        Page Banner
                      </Label>
                      <Input
                        type="file"
                        name="pageBanner"
                        id="pageBanner"
                        onChange={handleChange}
                        placeholder="Enter Page Banner"
                        invalid={!!formErrors.pageBanner}
                      />
                      <ValidationAlert error={formErrors.pageBanner} />
                    </Col>
                    {/* {formState.pageBanner && (
                      <Col md="4 mb-3">
                        <Card className="shadow-lg p-4">
                          <Label className="form-label" for="pageBannerPreview">
                            <h6>Preview</h6>
                          </Label>
                          <div className="text-center">
                            <img
                              src={URL.createObjectURL(formState.pageBanner)}
                              alt="Page Banner Preview"
                              style={{ width: "50%", height: "auto" }}
                              className="rounded-3"
                            />
                          </div>
                        </Card>
                      </Col>
                    )} */}
                    <Col md="6 mb-3">
                      <Label className="form-label" for="urlSlug">
                        URL Slug
                      </Label>
                      <Input
                        type="text"
                        name="urlSlug"
                        id="urlSlug"
                        value={formState.urlSlug}
                        onChange={handleChange}
                        placeholder="Enter URL Slug"
                        invalid={!!formErrors.urlSlug}
                      />
                      <ValidationAlert error={formErrors.urlSlug} />
                    </Col>
                    <Col md="12 my-3">
                      <FormGroup tag="fieldset">
                        <Row className="align-items-center">
                          <Col sm="auto">
                            <Label className="form-label">
                              Display in Navigation menu (Alphabetical order)
                            </Label>
                          </Col>
                          <Col sm="auto" className="mt-1">
                            <FormGroup check inline>
                              <Input
                                type="radio"
                                name="displayInNavMenu"
                                id="displayInNavMenuYes"
                                value="Yes"
                                checked={formState.displayInNavMenu === "Yes"}
                                onChange={handleRadioChange}
                              />{" "}
                              <Label check>Yes</Label>
                            </FormGroup>
                            <FormGroup check inline>
                              <Input
                                type="radio"
                                name="displayInNavMenu"
                                id="displayInNavMenuNo"
                                value="No"
                                checked={formState.displayInNavMenu === "No"}
                                onChange={handleRadioChange}
                              />{" "}
                              <Label check>No</Label>
                            </FormGroup>
                          </Col>
                        </Row>
                      </FormGroup>
                    </Col>
                    <Col md="6 mb-3">
                      <Label className="form-label" for="temporaryDeactive">
                        Temporary deactivate (Hide in the website)
                      </Label>
                      <Input
                        type="select"
                        name="temporaryDeactive"
                        id="temporaryDeactive"
                        className="form-control digits"
                        value={formState.temporaryDeactive}
                        onChange={handleChange}
                        invalid={!!formErrors.temporaryDeactive}
                      >
                        <option value="">Select doctor</option>
                        {["Active", "Inactive"].map((status, index) => (
                          <option key={index + status} value={status}>
                            {status}
                          </option>
                        ))}
                      </Input>
                      <ValidationAlert error={formErrors.temporaryDeactive} />
                    </Col>
                  </Row>
                  <Btn attrBtn={{ color: "primary" }}>{"Submit form"}</Btn>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SpecialityForm;
