import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, Row, Col, Button } from "react-bootstrap";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";

const DoctorsForm = ({ handleClose }) => {
  const [formState, setFormState] = useState({
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
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();

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

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleArrayChange = (name, index, value) => {
    setFormState((prev) => {
      const updatedArray = [...prev[name]];
      updatedArray[index] = value;
      return { ...prev, [name]: updatedArray };
    });
  };

  const addArrayField = (name) => {
    setFormState((prev) => ({
      ...prev,
      [name]: [...prev[name], ""],
    }));
  };

  const removeArrayField = (name, index) => {
    setFormState((prev) => ({
      ...prev,
      [name]: prev[name].filter((_, i) => i !== index),
    }));
  };

  const onSubmit = (data) => {
    // handle form submission
    handleClose();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row className="mx-0">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Full Name</Form.Label>
            <Input
              type="text"
              name="fullName"
              value={formState.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
            />
            <FormFeedback type="invalid">
              {errors.fullName?.message}
            </FormFeedback>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Mobile Number</Form.Label>
            <Input
              type="text"
              name="mobile"
              value={formState.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
              {...register("mobile", {
                required: "Mobile Number is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Enter a valid 10-digit mobile number",
                },
              })}
              isInvalid={!!errors.mobile}
            />
            <FormFeedback type="invalid">
              {errors.mobile?.message}
            </FormFeedback>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Input
              type="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              placeholder="Enter email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              isInvalid={!!errors.email}
            />
            <FormFeedback type="invalid">
              {errors.email?.message}
            </FormFeedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3 mx-0">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Medical Reg. Number</Form.Label>
            <Input
              type="text"
              name="regNumber"
              value={formState.regNumber}
              onChange={handleChange}
              placeholder="Enter medical reg. number"
              {...register("regNumber", {
                required: "Medical Reg. Number is required",
              })}
              isInvalid={!!errors.regNumber}
            />
            <FormFeedback type="invalid">
              {errors.regNumber?.message}
            </FormFeedback>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Department</Form.Label>
            <Form.Select
              {...register("department", {
                required: "Department is required",
              })}
              isInvalid={!!errors.department}
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
            </Form.Select>
            <FormFeedback type="invalid">
              {errors.department?.message}
            </FormFeedback>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Designation</Form.Label>
            <Input
              type="text"
              name="designation"
              value={formState.designation}
              onChange={handleChange}
              placeholder="Enter designation"
              {...register("designation", {
                required: "Designation is required",
              })}
              isInvalid={!!errors.designation}
            />
            <FormFeedback type="invalid">
              {errors.designation?.message}
            </FormFeedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3 mx-0">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Speciality</Form.Label>
            <Form.Select
              {...register("speciality", {
                required: "Speciality is required",
              })}
              isInvalid={!!errors.speciality}
            >
              <option value="">Select Speciality</option>
              {specialties.map((specialty, index) => (
                <option key={index + specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </Form.Select>
            <FormFeedback type="invalid">
              {errors.speciality?.message}
            </FormFeedback>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Year of Experience</Form.Label>
            <Input
              type="text"
              name="experience"
              value={formState.experience}
              onChange={handleChange}
              placeholder="Enter year of experience"
              {...register("experience", {
                required: "Year of Experience is required",
                min: { value: 0, message: "Experience cannot be negative" },
                max: { value: 60, message: "Experience seems too high" },
              })}
              isInvalid={!!errors.experience}
            />
            <FormFeedback type="invalid">
              {errors.experience?.message}
            </FormFeedback>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Languages Known</Form.Label>
            <Input
              type="text"
              name="languages"
              value={formState.languages}
              onChange={handleChange}
              placeholder="Enter languages known"
              {...register("languages", { required: "Languages are required" })}
              isInvalid={!!errors.languages}
            />
            <FormFeedback type="invalid">
              {errors.languages?.message}
            </FormFeedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3 mx-0">
        <Col md={12}>
          <Form.Group>
            <Form.Label>Expertise</Form.Label>
            {/* Should be HTML Editor */}
            <Input
              as="textarea"
              rows={5}
              name="expertise"
              value={formState.expertise}
              onChange={handleChange}
              placeholder="Enter expertise"
              {...register("expertise", { required: "Expertise is required" })}
              isInvalid={!!errors.expertise}
            />
            <FormFeedback type="invalid">
              {errors.expertise?.message}
            </FormFeedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3 mx-0">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Services Offered</Form.Label>
            <Input
              as="textarea"
              rows={1}
              name="services"
              value={formState.services}
              onChange={handleChange}
              placeholder="Enter services offered"
              {...register("services", {
                required: "Services Offered is required",
              })}
              isInvalid={!!errors.services}
            />
            <FormFeedback type="invalid">
              {errors.services?.message}
            </FormFeedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Consulting Location</Form.Label>
            <Input
              type="text"
              name="location"
              value={formState.location}
              onChange={handleChange}
              placeholder="Enter consulting location"
              {...register("location", {
                required: "Consulting Location is required",
              })}
              isInvalid={!!errors.location}
            />
            <FormFeedback type="invalid">
              {errors.location?.message}
            </FormFeedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3 mx-0">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Education Qualification</Form.Label>
            {formState.educationQualification.map((field, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <Input
                  type="text"
                  name={`educationQualification-${index}`}
                  value={field}
                  onChange={(e) =>
                    handleArrayChange(
                      "educationQualification",
                      index,
                      e.target.value
                    )
                  }
                  placeholder="Enter Education Qualification"
                  isInvalid={
                    formState.educationQualification.length === 0 &&
                    formState.educationQualification[index] === ""
                  }
                />
                &nbsp;&nbsp;
                <Button
                  variant={index === 0 ? "success" : "danger"}
                  size="sm"
                  className="rounded-circle"
                  onClick={
                    index === 0
                      ? () => addArrayField("educationQualification")
                      : () => removeArrayField("educationQualification", index)
                  }
                >
                  {index === 0 ? <FaPlusCircle /> : <FaMinusCircle />}
                </Button>
              </div>
            ))}
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3 mx-0">
        <Col md={12}>
          <Form.Group>
            <Form.Label>Experience - description</Form.Label>
            {/* Should be HTML Editor */}
            <Input
              as="textarea"
              rows={5}
              name="experienceDesc"
              value={formState.experienceDesc}
              onChange={handleChange}
              placeholder="Enter experience"
              {...register("experienceDesc", {
                required: "Experience description is required",
              })}
              isInvalid={!!errors.experienceDesc}
            />
            <FormFeedback type="invalid">
              {errors.experienceDesc?.message}
            </FormFeedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3 mx-0">
        <Col md={12}>
          <Form.Group>
            <Form.Label>Awards & Achievements</Form.Label>
            {/* Should be HTML Editor */}
            <Input
              as="textarea"
              rows={5}
              name="awards"
              value={formState.awards}
              onChange={handleChange}
              placeholder="Enter awards & achievements"
              {...register("awards", {
                required: "Awards & Achievements are required",
              })}
              isInvalid={!!errors.awards}
            />
            <FormFeedback type="invalid">
              {errors.awards?.message}
            </FormFeedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3 mx-0">
        <Col md={12}>
          <Form.Group>
            <Form.Label>Research & Publications</Form.Label>
            {/* Should be HTML Editor */}
            <Input
              as="textarea"
              rows={5}
              name="research"
              value={formState.research}
              onChange={handleChange}
              placeholder="Enter research & publications"
              {...register("research", {
                required: "Research & Publications are required",
              })}
              isInvalid={!!errors.research}
            />
            <FormFeedback type="invalid">
              {errors.research?.message}
            </FormFeedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3 mx-0">
        <Col md={6}>
          <Form.Group>
            <Form.Label>OP Timings</Form.Label>

            {formState.opTimings.map((field, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <Input
                  type="text"
                  name={`opTimings-${index}`}
                  value={field}
                  onChange={(e) =>
                    handleArrayChange("opTimings", index, e.target.value)
                  }
                  placeholder="Enter OP Timing (e.g. 9:00 AM - 5:00 PM)"
                  isInvalid={
                    formState.opTimings.length === 0 &&
                    formState.opTimings[index] === ""
                  }
                />
                &nbsp;&nbsp;
                <Button
                  variant={index === 0 ? "success" : "danger"}
                  size="sm"
                  className="rounded-circle"
                  onClick={
                    index === 0
                      ? () => addArrayField("opTimings")
                      : () => removeArrayField("opTimings", index)
                  }
                >
                  {index === 0 ? <FaPlusCircle /> : <FaMinusCircle />}
                </Button>
              </div>
            ))}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Profile Photo</Form.Label>
            <Input
              type="file"
              name="profilePhoto"
              onChange={handleChange}
              {...register("profilePhoto", {
                required: "Profile Photo is required",
              })}
              isInvalid={!!errors.profilePhoto}
            />
            <FormFeedback type="invalid">
              {errors.profilePhoto?.message}
            </FormFeedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3 mx-0">
        <Col md={12} className="d-flex justify-content-end">
          <Form.Group>
            <Button variant="primary" type="submit">
              Save
            </Button>
            &nbsp;
            <Button variant="secondary" onClick={handleClose} type="button">
              Cancel
            </Button>
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
};

export default DoctorsForm;
