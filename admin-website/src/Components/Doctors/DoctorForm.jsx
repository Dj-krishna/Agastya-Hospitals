import React, { Fragment, useEffect, useState } from "react";
import {
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  InputGroupText,
  Input,
  CardBody,
  Label,
  Row,
  Button,
} from "reactstrap";
import { Breadcrumbs, Btn } from "../../AbstractElements";
import HTMLTextEditor from "../Common/Component/HTMLTextEditor";
import { MinusSquare, PlusSquare } from "react-feather";
import ValidationAlert from "../Common/Component/ValidationAlert";
import { countryCodes } from "../../api/countryCode";
import {
  createDoctor,
  updateDoctor,
  fetchDepartments,
  fetchSpecialities,
} from "../../api/Services";
import { toasterConfig } from "../../utils";
import { toast } from "react-toastify";

const initialFormState = {
  fullName: "",
  mobile: "",
  email: "",
  medicalRegNumber: "",
  departmentName: "",
  designation: "",
  about: "",
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
  departmentName: "",
  designation: "",
  about: "",
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
  const [departments, setDepartments] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataError, setDataError] = useState(null);

  // Fetch departments and specialities data
  const fetchData = async () => {
    try {
      setIsLoadingData(true);
      setDataError(null);
      const [departmentsData, specialitiesData] = await Promise.all([
        fetchDepartments(),
        fetchSpecialities(),
      ]);
      setDepartments(departmentsData);
      setSpecialities(specialitiesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setDataError(
        "Failed to load departments and specialities. Please refresh the page."
      );
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Load initial data when editing
  useEffect(() => {
    if (initialData && isEditMode) {
      // Handle speciality data mapping for edit mode
      let mappedSpeciality = initialData.speciality;

      if (initialData.speciality) {
        if (Array.isArray(initialData.speciality)) {
          // Handle array format [1] - find speciality name by ID
          if (initialData.speciality.length > 0) {
            const specialityId = initialData.speciality[0];
            const foundSpeciality = specialities.find(
              (spec) => spec.specialityID === specialityId
            );
            if (foundSpeciality) {
              mappedSpeciality = foundSpeciality.specialityName;
            }
          }
        } else if (typeof initialData.speciality === "object") {
          // Handle object format {"1": "Cardiology"}
          const specialityValues = Object.values(initialData.speciality);
          if (specialityValues.length > 0) {
            mappedSpeciality = specialityValues[0];
          }
        }
      }

      setFormState({
        ...initialFormState,
        ...initialData,
        speciality: mappedSpeciality,
        // Handle array fields properly
        educationQualification: initialData.educationQualification || [""],
        opTimings: initialData.opTimings || [""],
        about: initialData.about || "NA",
      });
    }
  }, [initialData, isEditMode, specialities]);

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
      case "about":
        return value === "" ? "About doctor is required" : "";
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
        const formattedName = formState.fullName.startsWith("Dr. ")
          ? formState.fullName
          : `Dr. ${formState.fullName}`;
        const submitData = { ...formState };

        submitData.fullName = formattedName;

        // Format speciality data according to expected API format
        if (submitData.speciality) {
          // Find the speciality object that matches the selected speciality name
          const selectedSpeciality = specialities.find(
            (spec) => spec.specialityName === submitData.speciality
          );
          if (selectedSpeciality) {
            // For update API, use array of IDs; for create API, use object format
            if (isEditMode) {
              submitData.speciality = [selectedSpeciality.specialityID];
              console.log(
                "Update mode - speciality formatted as array:",
                submitData.speciality
              );
            } else {
              submitData.speciality = {
                [selectedSpeciality.specialityID.toString()]:
                  selectedSpeciality.specialityName,
              };
              console.log(
                "Create mode - speciality formatted as object:",
                submitData.speciality
              );
            }
          }
        }

        // Format department data
        if (submitData.departmentName) {
          // Find the department object that matches the selected department name
          const selectedDepartment = departments.find(
            (dept) => dept.departmentName === submitData.departmentName
          );
          if (selectedDepartment) {
            submitData.departmentID = selectedDepartment.departmentID;
          }
        }

        if (submitData.profilePhoto instanceof File) {
          delete submitData.profilePhoto; // Remove file object for now
        }

        if (isEditMode && initialData?.doctorID) {
          // Update existing doctor
          console.log("submitdata", submitData);
          const response = await updateDoctor(initialData.doctorID, submitData);
          console.log("Doctor updated successfully", response);
          toasterConfig("success", "Doctor updated successfully");
        } else {
          // Create new doctor
          await createDoctor(submitData);
          console.log("success", "Doctor created successfully");
          toasterConfig("success", "Doctor created successfully");
        }
        // Close form and refresh data
        if (onClose) {
          onClose();
        }
      } catch (error) {
        console.error("Error saving doctor:", error);
        toasterConfig("error", "Failed to save doctor data");
        // You can add error handling here (show toast, etc.)
      } finally {
        setIsSubmitted(false);
        setIsLoading(false);
      }
    } else {
      console.log("Validation failed");
      setIsLoading(false);
    }
  };

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
                  {isLoadingData && (
                    <Row>
                      <Col md="12" className="mb-3">
                        <div className="alert alert-info text-center">
                          <i className="fa fa-spinner fa-spin me-2"></i>
                          Loading departments and specialities...
                        </div>
                      </Col>
                    </Row>
                  )}
                  {dataError && (
                    <Row>
                      <Col md="12" className="mb-3">
                        <div className="alert alert-danger text-center">
                          <i className="fa fa-exclamation-triangle me-2"></i>
                          {dataError}
                          <br />
                          <Button
                            color="primary"
                            size="sm"
                            className="mt-2"
                            onClick={() => {
                              setDataError(null);
                              setIsLoadingData(true);
                              fetchData();
                            }}
                          >
                            <i className="fa fa-refresh me-1"></i>
                            Retry
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  )}
                  <Row>
                    <Col md="4 mb-3">
                      <Label className="form-label" for="fullName">
                        Full name
                      </Label>
                      <InputGroup
                        className={formErrors.fullName ? " is-invalid" : ""}
                      >
                        <InputGroupText>{"Dr. "}</InputGroupText>
                        <Input
                          type="text"
                          name="fullName"
                          id="fullName"
                          value={formState.fullName.replace(/^(Dr\.)\s*/, "")}
                          onChange={handleChange}
                          placeholder="Enter full name"
                          invalid={!!formErrors.fullName}
                        />
                      </InputGroup>
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
                        name="departmentName"
                        id="department"
                        className="form-control digits"
                        invalid={!!formErrors.departmentName}
                        value={formState.departmentName}
                        onChange={handleChange}
                        disabled={isLoadingData}
                      >
                        <option value="">
                          {isLoadingData
                            ? "Loading departments..."
                            : "Select Department"}
                        </option>
                        {departments.map((department) => (
                          <option
                            key={department._id}
                            value={department.departmentName}
                          >
                            {department.departmentName}
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
                    <Col md="4" className="mb-3">
                      <Label>About Doctor</Label>
                      <Input
                        type="textarea"
                        name="about"
                        value={formState.about}
                        onChange={handleChange}
                        placeholder="Enter about doctor"
                        invalid={!!formErrors.about}
                      />
                      <ValidationAlert error={formErrors.about} />
                    </Col>
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
                        disabled={isLoadingData}
                      >
                        <option value="">
                          {isLoadingData
                            ? "Loading specialities..."
                            : "Select Speciality"}
                        </option>
                        {specialities.map((speciality) => (
                          <option
                            key={speciality._id}
                            value={speciality.specialityName}
                          >
                            {speciality.specialityName}
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
                        handleChange={(value) =>
                          handleQuillChange("experienceDescription", value)
                        }
                        placeholder="Enter experience description"
                        onBlur={() => handleQuillBlur("experienceDescription")}
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
                      <Label
                        className="form-label"
                        for="researchAndPublications"
                      >
                        Research & Publications
                      </Label>
                      <HTMLTextEditor
                        name="researchAndPublications"
                        state={formState.researchAndPublications}
                        handleChange={(value) =>
                          handleQuillChange("researchAndPublications", value)
                        }
                        placeholder="Enter research and publications"
                        onBlur={() =>
                          handleQuillBlur("researchAndPublications")
                        }
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
                      disabled: isLoading,
                    }}
                  >
                    {isLoading
                      ? "Saving..."
                      : isEditMode
                      ? "Update Doctor"
                      : "Save Doctor"}
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
