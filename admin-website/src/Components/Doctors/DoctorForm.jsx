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
import { createDoctor, updateDoctor } from "../../api/Services";

const initialFormState = {
  fullName: "",
  mobile: "",
  email: "",
  medicalRegNumber: "",
  department: "",
  designation: "",
  speciality: "",
  languagesKnown: "",
  expertise: "",
  servicesOffered: "",
  consultingLocation: "",
  educationQualification: [""],
  experienceDescription: "",
  awardsAndAchievements: "",
  researchAndPublications: "",
  opTimings: [""],
  profilePhoto: null,
  countryCode: "+91",
  gender: "",
  yearsOfExperience: "",
};

const initialFormErrors = {
  fullName: "",
  mobile: "",
  email: "",
  medicalRegNumber: "",
  department: "",
  designation: "",
  speciality: "",
  languagesKnown: "",
  expertise: "",
  servicesOffered: "",
  consultingLocation: "",
  educationQualification: [""],
  experienceDescription: "",
  awardsAndAchievements: "",
  researchAndPublications: "",
  opTimings: [""],
  profilePhoto: null,
  countryCode: "",
  gender: "",
  yearsOfExperience: "",
};

const DoctorForm = ({ onClose, initialData = null, isEditMode = false }) => {
  const [formState, setFormState] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load initial data when editing
  useEffect(() => {
    if (initialData && isEditMode) {
      setFormState({
        ...initialFormState,
        ...initialData,
        // Handle array fields properly
        educationQualification: initialData.educationQualification || [""],
        opTimings: initialData.opTimings || [""],
      });
    }
  }, [initialData, isEditMode]);

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
      case "medicalRegNumber":
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
      case "yearsOfExperience":
        return value === "" ? "Years of Experience is required" : "";
      case "gender":
        return value === "" ? "Gender is required" : "";
      case "languagesKnown":
        return value === "" ? "Languages are required" : "";
      case "servicesOffered":
        return value === "" ? "Services are required" : "";
      case "consultingLocation":
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

  const onSubmit = async (e, data) => {
    e.preventDefault();
    setIsSubmitted(true);
    setIsLoading(true);

    const newformErrors = {};
    Object.keys(formState).forEach((key) => {
      if (key === "educationQualification" || key === "opTimings") {
        newformErrors[key] = formState[key].map((val, _i) =>
          validateField(key, val)
        );
      } else if (
        key === "expertise" ||
        key === "awardsAndAchievements" ||
        key === "researchAndPublications" ||
        key === "experienceDescription"
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
      try {
        // Prepare data for API (remove profilePhoto if it's a File object)
        const submitData = { ...formState };
        if (submitData.profilePhoto instanceof File) {
          delete submitData.profilePhoto; // Remove file object for now
        }

        if (isEditMode && initialData?.doctorID) {
          // Update existing doctor
          console.log("submitdata",submitData);
          await updateDoctor(initialData.doctorID, submitData);
          console.log("Doctor updated successfully");
        } else {
          // Create new doctor
          await createDoctor(submitData);
          console.log("Doctor created successfully");
        }
        
        // Close form and refresh data
        if (onClose) {
          onClose();
        }
      } catch (error) {
        console.error("Error saving doctor:", error);
        // You can add error handling here (show toast, etc.)
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log("Validation failed");
      setIsLoading(false);
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
        mainTitle={isEditMode ? "Edit Doctor" : "Add Doctor"}
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
                      <Label className="form-label" for="medicalRegNumber">
                        Medical Reg. Number
                      </Label>
                      <Input
                        type="text"
                        name="medicalRegNumber"
                        value={formState.medicalRegNumber}
                        onChange={handleChange}
                        placeholder="Enter medical reg. number"
                        invalid={!!formErrors.medicalRegNumber}
                      />
                      <ValidationAlert error={formErrors.medicalRegNumber} />
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
                      <Label className="form-label" for="yearsOfExperience">
                        Years of Experience
                      </Label>
                      <Input
                        type="text"
                        name="yearsOfExperience"
                        value={formState.yearsOfExperience}
                        onChange={handleChange}
                        placeholder="Enter years of experience"
                        invalid={!!formErrors.yearsOfExperience}
                      />
                      <ValidationAlert error={formErrors.yearsOfExperience} />
                    </Col>
                    <Col md="4 mb-3">
                      <Label className="form-label" for="gender">
                        Gender
                      </Label>
                      <Input
                        type="select"
                        name="gender"
                        value={formState.gender}
                        onChange={handleChange}
                        invalid={!!formErrors.gender}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Input>
                      <ValidationAlert error={formErrors.gender} />
                    </Col>
                    <Col md="4 mb-3">
                      <Label className="form-label" for="languagesKnown">
                        Languages Known
                      </Label>
                      <Input
                        type="text"
                        name="languagesKnown"
                        value={formState.languagesKnown}
                        onChange={handleChange}
                        placeholder="Enter languages spoken"
                        invalid={!!formErrors.languagesKnown}
                      />
                      <ValidationAlert error={formErrors.languagesKnown} />
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
                      <Label className="form-label" for="servicesOffered">
                        Services Offered
                      </Label>
                      <Input
                        type="text"
                        name="servicesOffered"
                        value={formState.servicesOffered}
                        onChange={handleChange}
                        placeholder="Enter services"
                        invalid={!!formErrors.servicesOffered}
                      />
                      <ValidationAlert error={formErrors.servicesOffered} />
                    </Col>
                    <Col md="6 mb-3">
                      <Label className="form-label" for="consultingLocation">
                        Consulting Location
                      </Label>
                      <Input
                        type="text"
                        name="consultingLocation"
                        value={formState.consultingLocation}
                        onChange={handleChange}
                        placeholder="Enter location"
                        invalid={!!formErrors.consultingLocation}
                      />
                      <ValidationAlert error={formErrors.consultingLocation} />
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
                      <Label className="form-label" for="experienceDescription">
                        Experience - Description
                      </Label>
                      <HTMLTextEditor
                        name="experienceDescription"
                        state={formState.experienceDescription}
                        onChange={(value) =>
                          handleQuillChange("experienceDescription", value)
                        }
                        placeholder="Enter experience description"
                        onBlur={() => handleQuillBlur("expertise")}
                        errors={
                          formErrors.experienceDescription && (
                            <div className="text-danger">
                              {formErrors.experienceDescription}
                            </div>
                          )
                        }
                      />
                    </Col>
                    <Col md="12 mb-3">
                      <Label className="form-label" for="awardsAndAchievements">
                        Awards & Achievements
                      </Label>
                      <HTMLTextEditor
                        name="awardsAndAchievements"
                        state={formState.awardsAndAchievements}
                        handleChange={(value) =>
                          handleQuillChange("awardsAndAchievements", value)
                        }
                        placeholder="Enter awards and achievements"
                        onBlur={() => handleQuillBlur("awardsAndAchievements")}
                        errors={
                          formErrors.awardsAndAchievements && (
                            <div className="text-danger">
                              {formErrors.awardsAndAchievements}
                            </div>
                          )
                        }
                      />
                    </Col>
                    <Col md="12 mb-3">
                      <Label className="form-label" for="researchAndPublications">
                        Research & Publications
                      </Label>
                      <HTMLTextEditor
                        name="researchAndPublications"
                        state={formState.researchAndPublications}
                        handleChange={(value) =>
                          handleQuillChange("researchAndPublications", value)
                        }
                        placeholder="Enter research and publications"
                        onBlur={() => handleQuillBlur("researchAndPublications")}
                        errors={
                          formErrors.researchAndPublications && (
                            <div className="text-danger">
                              {formErrors.researchAndPublications}
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
                  <Btn 
                    attrBtn={{ 
                      color: "primary", 
                      type: "submit",
                      disabled: isLoading 
                    }}
                  >
                    {isLoading ? "Saving..." : (isEditMode ? "Update Doctor" : "Save Doctor")}
                  </Btn>
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
