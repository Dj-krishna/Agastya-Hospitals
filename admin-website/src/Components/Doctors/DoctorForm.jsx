import React, { Fragment, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  Col,
  Container,
  Form,
  InputGroup,
  InputGroupText,
  Input,
  CardBody,
  Label,
  Row,
  FormFeedback,
  Button,
} from "reactstrap";
import { Breadcrumbs, Btn, H5 } from "../../AbstractElements";
import { useFieldArray, useForm } from "react-hook-form";
import HTMLTextEditor from "../Common/Component/HTMLTextEditor";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { MinusSquare, PlusSquare } from "react-feather";
import { fi } from "date-fns/locale";
import ValidationAlert from "../Common/Component/ValidationAlert";
import axios from "axios";
import { countryCodes } from "../../api/countryCode";

const initialFormState = {
  fullName: "",
  mobile: "",
  email: "",
  regNumber: "",
  department: "",
  designation: "",
  speciality: "",
  experience: "",
  languages: "",
  expertise: "",
  services: "",
  location: "",
  educationQualification: [""],
  experienceDesc: "",
  awards: "",
  research: "",
  opTimings: [""],
  profilePhoto: null,
  countryCode: "+91",
};

const initialFormErrors = {
  fullName: "",
  mobile: "",
  email: "",
  regNumber: "",
  department: "",
  designation: "",
  speciality: "",
  experience: "",
  languages: "",
  expertise: "",
  services: "",
  location: "",
  educationQualification: [""],
  experienceDesc: "",
  awards: "",
  research: "",
  opTimings: [""],
  profilePhoto: null,
  countryCode: "",
};

const DoctorForm = ({ onClose }) => {
  const [formState, setFormState] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [isSubmitted, setIsSubmitted] = useState(false);

  console.log("formState", formState);

  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        return value.trim() === "" ? "Full Name is required" : "";
      case "mobile":
        return /^[0-9]\d{9}$/.test(value)
          ? ""
          : "Valid Mobile Number is required";
      case "email":
        return /\S+@\S+\.\S+/.test(value) ? "" : "Valid Email is required";
      case "regNumber":
        return value === "" ? "Medical Reg. Number is required" : "";
      case "department":
        return value === "" ? "Department is required" : "";
      case "speciality":
        return value === "" ? "Speciality is required" : "";
      case "designation":
        return value === "" ? "Designation is required" : "";
      case "educationQualification":
      case "opTimings":
        return value === "" ? "This field is required" : "";
      case "experience":
        return value === "" ? "Experience is required" : "";
      case "languages":
        return value === "" ? "Languages are required" : "";
      case "services":
        return value === "" ? "Services are required" : "";
      case "location":
        return value === "" ? "Location is required" : "";
      default:
        return "";
    }
  };

  const validateQuillField = (fieldName, value) => {
    const stripped = value.replace(/<[^>]+>/g, "").trim();
    return stripped === "" ? "This field is required" : "";
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

  const handleArrayChange = (name, index, value) => {
    const updatedErrors = [...formErrors[name]];
    setFormState((prev) => {
      const updatedArray = [...prev[name]];
      updatedArray[index] = value;
      return { ...prev, [name]: updatedArray };
    });
    if (isSubmitted) {
      updatedErrors[index] = validateField(name, value);
    }
    setFormErrors((prev) => ({ ...prev, [name]: updatedErrors }));
  };

  const addArrayField = (name) => {
    setFormState((prev) => ({
      ...prev,
      [name]: [...prev[name], ""],
    }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: [...prev[name], ""],
    }));
  };

  const removeArrayField = (name, index) => {
    setFormState((prev) => ({
      ...prev,
      [name]: prev[name].filter((_, i) => i !== index),
    }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: prev[name].filter((_, i) => i !== index),
    }));
  };

  const onSubmit = (e, data) => {
    e.preventDefault();
    setIsSubmitted(true);

    const newformErrors = {};
    Object.keys(formState).forEach((key) => {
      if (key === "educationQualification" || key === "opTimings") {
        newformErrors[key] = formState[key].map((val, _i) =>
          validateField(key, val)
        );
      } else if (
        key === "expertise" ||
        key === "awards" ||
        key === "research" ||
        key === "experienceDesc"
      ) {
        newformErrors[key] = validateQuillField(key, formState[key]);
      } else {
        newformErrors[key] = validateField(key, formState[key]);
      }
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

  console.log("education", formErrors.educationQualification);

  const specialties = [
    "Cardiology",
    "Critical Care",
    "Emergency Services",
    "Neuro Science",
    "Gastroenterology",
    "Orthopaedics",
    "Gynaecology",
    "Oncology",
    "General Medicine",
    "General Surgery",
    "Liver Transplant",
    "Nephrology",
    "Pulmonology",
    "Robotic Science",
    "Spine Surgery",
    "ENT",
    "Endocrinology",
    "Urology",
    "Rheumatology",
    "Dermatology",
    "Hepatology",
    "Pain Medicine",
    "Movement Disorders",
    "Parkinson’s Center",
    "Radiology",
    "Physiotherapy",
    "Dental Surgery",
  ];

  // Clinical Departments
  const clinicalDepartments = [
    "Emergency Department (ED) / Casualty",
    "Outpatient Department (OPD)",
    "Inpatient Department (IPD)",
    "Surgery / Operating Theatres",
    "Intensive Care Unit (ICU)",
    "General Medicine",
    "General Surgery",
    "Obstetrics and Gynecology (OB/GYN)",
    "Pediatrics",
    "Orthopedics",
    "Cardiology",
    "Neurology",
    "Neurosurgery",
    "Nephrology",
    "Urology",
    "Gastroenterology",
    "Oncology",
    "Hematology",
    "Pulmonology / Respiratory Medicine",
    "Endocrinology",
    "Dermatology",
    "Ophthalmology (Eye)",
    "Otolaryngology (ENT – Ear, Nose, Throat)",
    "Dentistry / Oral & Maxillofacial Surgery",
    "Rheumatology",
    "Psychiatry / Mental Health",
    "Infectious Diseases",
    "Geriatrics (Elderly Care)",
  ];

  // Diagnostic & Laboratory Departments
  const diagnosticDepartments = [
    "Radiology / Imaging (X-ray, MRI, CT)",
    "Pathology",
    "Microbiology",
    "Biochemistry",
    "Hematology Lab",
    "Molecular Diagnostics",
  ];

  // Supportive & Allied Services
  const supportiveServices = [
    "Pharmacy",
    "Physiotherapy",
    "Dietetics / Nutrition",
    "Anesthesiology",
    "Biomedical Engineering",
    "Blood Bank / Transfusion Services",
    "Ambulance / Transport",
    "Medical Records",
  ];

  // Administrative & Other Departments
  const administrativeDepartments = [
    "Administration / Management",
    "Billing and Insurance",
    "IT / Health Informatics",
    "Human Resources",
    "Housekeeping",
    "Security",
    "Maintenance / Engineering",
    "Laundry / Linen Services",
  ];

  console.log("countryCode", countryCodes);
  return (
    <>
      <Breadcrumbs
        mainTitle="Add Doctor"
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
                      <Label className="form-label" for="mobileNumber">
                        Mobile
                      </Label>
                      <InputGroup
                        className={formErrors.mobile ? " is-invalid" : ""}
                      >
                        <Input
                          type="select"
                          name="countryCode"
                          value={formState.countryCode}
                          onChange={handleChange}
                          style={{ maxWidth: "100px" }}
                          invalid={!!formErrors.countryCode}
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
                          id="mobileNumber"
                          value={formState.mobile}
                          onChange={handleChange}
                          placeholder="Enter mobile number"
                          invalid={!!formErrors.mobile}
                          maxLength={10}
                        />
                      </InputGroup>
                      <ValidationAlert error={formErrors.mobile} />
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
                  </Row>
                  <Row>
                    <Col md="4 mb-3">
                      <Label className="form-label" for="regNumber">
                        Medical Reg. Number
                      </Label>
                      <Input
                        type="text"
                        name="regNumber"
                        value={formState.regNumber}
                        onChange={handleChange}
                        placeholder="Enter medical reg. number"
                        invalid={!!formErrors.regNumber}
                      />
                      <ValidationAlert error={formErrors.regNumber} />
                    </Col>
                    <Col md="4 mb-3">
                      <Label className="form-label" for="department">
                        Department
                      </Label>
                      <Input
                        type="select"
                        name="department"
                        id="department"
                        className="form-control digits"
                        invalid={!!formErrors.department}
                        value={formState.department}
                        onChange={handleChange}
                      >
                        <option value="">Select Department</option>
                        {[
                          ...clinicalDepartments,
                          ...diagnosticDepartments,
                          ...supportiveServices,
                          ...administrativeDepartments,
                        ].map((department, index) => (
                          <option key={index + department} value={department}>
                            {department}
                          </option>
                        ))}
                      </Input>
                      <ValidationAlert error={formErrors.department} />
                    </Col>
                    <Col md="4" className="mb-3">
                      <Label>Designation</Label>
                      <Input
                        type="text"
                        name="designation"
                        value={formState.designation}
                        onChange={handleChange}
                        placeholder="Enter designation"
                        invalid={!!formErrors.designation}
                      />
                      <ValidationAlert error={formErrors.designation} />
                    </Col>
                  </Row>
                  <Row>
                    <Col md="4 mb-3">
                      <Label className="form-label" for="speciality">
                        Speciality
                      </Label>
                      <Input
                        type="select"
                        name="speciality"
                        id="speciality"
                        value={formState.speciality}
                        onChange={handleChange}
                        className="form-control digits"
                        invalid={!!formErrors.speciality}
                      >
                        <option value="">Select Speciality</option>
                        {specialties.map((spec, index) => (
                          <option key={index + spec} value={spec}>
                            {spec}
                          </option>
                        ))}
                      </Input>
                      <ValidationAlert error={formErrors.speciality} />
                    </Col>
                    <Col md="4 mb-3">
                      <Label className="form-label" for="experience">
                        Years of Experience
                      </Label>
                      <Input
                        type="text"
                        name="experience"
                        value={formState.experience}
                        onChange={handleChange}
                        placeholder="Enter experience"
                        invalid={!!formErrors.experience}
                      />
                      <ValidationAlert error={formErrors.experience} />
                    </Col>
                    <Col md="4 mb-3">
                      <Label className="form-label" for="languages">
                        Languages Known
                      </Label>
                      <Input
                        type="text"
                        name="languages"
                        value={formState.languages}
                        onChange={handleChange}
                        placeholder="Enter languages spoken"
                        invalid={!!formErrors.languages}
                      />
                      <ValidationAlert error={formErrors.languages} />
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12 mb-3">
                      <Label className="form-label" for="expertise">
                        Areas of Expertise
                      </Label>
                      <HTMLTextEditor
                        name="expertise"
                        state={formState.expertise}
                        handleChange={(value) =>
                          handleQuillChange("expertise", value)
                        }
                        placeholder="Enter areas of expertise"
                        onBlur={() => handleQuillBlur("expertise")}
                        errors={
                          formErrors.expertise && (
                            <div className="text-danger">
                              {formErrors.expertise}
                            </div>
                          )
                        }
                      />
                    </Col>
                    <Col md="6 mb-3">
                      <Label className="form-label" for="services">
                        Services Offered
                      </Label>
                      <Input
                        type="text"
                        name="services"
                        value={formState.services}
                        onChange={handleChange}
                        placeholder="Enter services"
                        invalid={!!formErrors.services}
                      />
                      <ValidationAlert error={formErrors.services} />
                    </Col>
                    <Col md="6 mb-3">
                      <Label className="form-label" for="location">
                        Consulting Location
                      </Label>
                      <Input
                        type="text"
                        name="location"
                        value={formState.location}
                        onChange={handleChange}
                        placeholder="Enter location"
                        invalid={!!formErrors.location}
                      />
                      <ValidationAlert error={formErrors.location} />
                    </Col>
                  </Row>
                  <Row>
                    <Col md="8 mb-3">
                      <Label>Education Qualification</Label>
                      {formState.educationQualification.map((field, index) => (
                        <Fragment key={index}>
                          <div className="d-flex align-items-center mb-2">
                            <Input
                              className={`form-control${
                                formErrors.educationQualification[index]
                                  ? " is-invalid"
                                  : ""
                              }`}
                              type="text"
                              placeholder={
                                "Enter Education Qualification " +
                                Number(index + 1)
                              }
                              name={`educationQualification${index}`}
                              value={field}
                              onChange={(e) =>
                                handleArrayChange(
                                  "educationQualification",
                                  index,
                                  e.target.value
                                )
                              }
                              invalid={
                                !!formErrors.educationQualification[index]
                              }
                            />
                            &nbsp;&nbsp;
                            <span
                              style={{
                                cursor: "pointer",
                                color: index === 0 ? "green" : "red",
                              }}
                              onClick={
                                index === 0
                                  ? () => {
                                      addArrayField("educationQualification");
                                      setFormErrors((prev) => ({
                                        ...prev,
                                        educationQualification: [
                                          ...(prev.educationQualification ||
                                            []),
                                          "",
                                        ],
                                      }));
                                    }
                                  : () => {
                                      removeArrayField(
                                        "educationQualification",
                                        index
                                      );
                                      setFormErrors((prev) => ({
                                        ...prev,
                                        educationQualification: (
                                          prev.educationQualification || []
                                        ).filter((_, i) => i !== index),
                                      }));
                                    }
                              }
                            >
                              {index === 0 ? <PlusSquare /> : <MinusSquare />}
                            </span>
                          </div>
                          <ValidationAlert
                            error={formErrors.educationQualification[index]}
                          />
                        </Fragment>
                      ))}
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12 mb-3">
                      <Label className="form-label" for="experienceDesc">
                        Experience - Description
                      </Label>
                      <HTMLTextEditor
                        name="experienceDesc"
                        state={formState.experienceDesc}
                        onChange={(value) =>
                          handleQuillChange("experienceDesc", value)
                        }
                        placeholder="Enter experience description"
                        onBlur={() => handleQuillBlur("expertise")}
                        errors={
                          formErrors.experienceDesc && (
                            <div className="text-danger">
                              {formErrors.experienceDesc}
                            </div>
                          )
                        }
                      />
                    </Col>
                    <Col md="12 mb-3">
                      <Label className="form-label" for="awards">
                        Awards & Achievements
                      </Label>
                      <HTMLTextEditor
                        name="awards"
                        state={formState.awards}
                        handleChange={(value) =>
                          handleQuillChange("awards", value)
                        }
                        placeholder="Enter awards and achievements"
                        onBlur={() => handleQuillBlur("awards")}
                        errors={
                          formErrors.awards && (
                            <div className="text-danger">
                              {formErrors.awards}
                            </div>
                          )
                        }
                      />
                    </Col>
                    <Col md="12 mb-3">
                      <Label className="form-label" for="research">
                        Research & Publications
                      </Label>
                      <HTMLTextEditor
                        name="research"
                        state={formState.research}
                        handleChange={(value) =>
                          handleQuillChange("research", value)
                        }
                        placeholder="Enter research and publications"
                        onBlur={() => handleQuillBlur("research")}
                        errors={
                          formErrors.research && (
                            <div className="text-danger">
                              {formErrors.research}
                            </div>
                          )
                        }
                      />
                    </Col>
                    <Col md="8 mb-3">
                      <Label className="form-label" for="opTimings">
                        OP Timings
                      </Label>
                      {formState.opTimings.map((field, index) => (
                        <Fragment key={index}>
                          <div className="d-flex align-items-center mb-2">
                            <Input
                              className={`form-control${
                                formErrors.opTimings[index] ? " is-invalid" : ""
                              }`}
                              type="text"
                              placeholder={
                                "Enter OP Timing " +
                                Number(index + 1) +
                                " (e.g., 9 AM - 5 PM)"
                              }
                              value={formState.opTimings[index]}
                              name={`opTimings${index}`}
                              onChange={(e) =>
                                handleArrayChange(
                                  "opTimings",
                                  index,
                                  e.target.value
                                )
                              }
                              invalid={!!formErrors.opTimings[index]}
                            />
                            &nbsp;&nbsp;
                            <span
                              style={{
                                cursor: "pointer",
                                color: index === 0 ? "green" : "red",
                              }}
                              onClick={
                                index === 0
                                  ? () => {
                                      addArrayField("opTimings");
                                      setFormErrors((prev) => ({
                                        ...prev,
                                        opTimings: [
                                          ...(prev.opTimings || []),
                                          "",
                                        ],
                                      }));
                                    }
                                  : () => {
                                      removeArrayField("opTimings", index);
                                      setFormErrors((prev) => ({
                                        ...prev,
                                        opTimings: (
                                          prev.opTimings || []
                                        ).filter((_, i) => i !== index),
                                      }));
                                    }
                              }
                            >
                              {index === 0 ? <PlusSquare /> : <MinusSquare />}
                            </span>
                          </div>
                          <ValidationAlert
                            error={formErrors.opTimings[index]}
                          />
                        </Fragment>
                      ))}
                    </Col>
                    <Col md="6 mb-3">
                      <Label className="form-label" for="profilePhoto">
                        Profile Photo
                      </Label>
                      <Input
                        type="file"
                        name="profilePhoto"
                        id="profilePhoto"
                        onChange={handleChange}
                        placeholder="Enter profile photo"
                        invalid={!!formErrors.profilePhoto}
                      />
                      <ValidationAlert error={formErrors.profilePhoto} />
                    </Col>
                    {formState.profilePhoto && (
                      <Col md="4 mb-3">
                        <Card className="shadow-lg p-4">
                          <Label className="form-label" for="profilePhoto">
                            <h6>Preview</h6>
                          </Label>
                          <div className="text-center">
                            <img
                              src={URL.createObjectURL(formState.profilePhoto)}
                              alt="Profile Preview"
                              style={{ width: "50%", height: "auto" }}
                              className="rounded-3"
                            />
                          </div>
                        </Card>
                      </Col>
                    )}
                  </Row>
                  <Btn attrBtn={{ color: "primary" }}>{"Submit"}</Btn>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default DoctorForm;
