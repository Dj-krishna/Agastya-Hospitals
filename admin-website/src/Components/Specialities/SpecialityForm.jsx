import React, { Fragment, useEffect, useState } from "react";
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
  Button,
} from "reactstrap";
import ValidationAlert from "../Common/Component/ValidationAlert";
import HTMLTextEditor from "../Common/Component/HTMLTextEditor";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "../../slices/doctorsSlice";
import { createSpeciality, updateSpeciality } from "../../api/Services";
import { toast } from "react-toastify";

const initialFormState = {
  specialityName: "",
  icon: "",
  displayOrder: "",
  doctor: "",
  shortDescription: "",
  pageDescription: "",
  banner: "",
  seoMetaData: "",
  urlSlug: "",
  isNavigationDisplay: true,
  isActive: true,
  createdBy: "admin",
  updatedBy: "admin",
};

const initialFormErrors = {
  specialityName: "",
  icon: "",
  displayOrder: "",
  doctor: "",
  shortDescription: "",
  pageDescription: "",
  banner: "",
  seoMetaData: "",
  urlSlug: "",
  isNavigationDisplay: "",
  isActive: "",
};

const SpecialityForm = ({ onClose, initialData = null, isEditMode = false }) => {
  const [formState, setFormState] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const { data: doctors } = useSelector((state) => state.doctors);

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  // Load initial data when editing
  useEffect(() => {
    if (initialData && isEditMode) {
      setFormState({
        ...initialFormState,
        ...initialData,
        // Map the fields to match our form state
        specialityName: initialData.specialityName || "",
        icon: Array.isArray(initialData.icon) ? initialData.icon[0] || "" : (initialData.icon || ""),
        displayOrder: initialData.displayOrder || "",
        doctor: initialData.doctor || initialData.doctorID || "",
        shortDescription: initialData.shortDescription || "",
        pageDescription: initialData.pageDescription || "",
        banner: Array.isArray(initialData.banner) ? initialData.banner[0] || "" : (initialData.banner || ""),
        seoMetaData: initialData.seoMetaData || "",
        urlSlug: initialData.urlSlug || "",
        isNavigationDisplay: initialData.isNavigationDisplay !== undefined ? initialData.isNavigationDisplay : true,
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
        createdBy: initialData.createdBy || "admin",
        updatedBy: initialData.updatedBy || "admin",
      });
    }
  }, [initialData, isEditMode]);

  const validateAllFields = (name, value) => {
    const isEmpty = (val) => {
      if (val instanceof File) {
        return false; // File is not empty
      }
      return typeof val === "string" ? val.trim() === "" : !val;
    };

    const requiredFields = {
      specialityName: "Speciality name is required",
      // icon: "Icon is required", // Made optional for now
      // displayOrder: "Display Order is required", // Made optional
      doctor: "Assign Doctor is required",
      shortDescription: "Short description is required",
      pageDescription: "Page description is required",
      // banner: "Page banner is required", // Made optional for now
      // seoMetaData: "SEO metadata is required", // Made optional
      urlSlug: "URL slug is required",
      isNavigationDisplay: "Navigation display setting is required",
      isActive: "Active status is required",
    };

    if (requiredFields[name]) {
      return isEmpty(value) ? requiredFields[name] : "";
    }

    return "";
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    let fieldValue;
    if (type === "file") {
      fieldValue = files[0] || null;
    } else {
      fieldValue = value;
    }
    
    setFormState((prevState) => ({
      ...prevState,
      [name]: fieldValue,
    }));
    
    if (isSubmitted) {
      const error = validateAllFields(name, fieldValue);
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));
    }
  };

  const handleRadioChange = (e) => {
    setFormState((prev) => ({
      ...prev,
      isNavigationDisplay: e.target.value === "Yes", // convert string to boolean
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

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setIsSubmitting(true);

    const newErrors = {};
    Object.keys(formState).forEach((key) => {
      const error = validateAllFields(key, formState[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    setFormErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        // Prepare data for API - match the API structure from your example
        const submitData = {
          specialityName: formState.specialityName,
          urlSlug: formState.urlSlug,
          shortDescription: formState.shortDescription,
          pageDescription: formState.pageDescription,
          isActive: formState.isActive,
          isNavigationDisplay: formState.isNavigationDisplay,
          doctor: parseInt(formState.doctor),
        // Handle file fields - keep File objects for FormData
        icon: formState.icon instanceof File ? formState.icon : (formState.icon || ""),
        banner: formState.banner instanceof File ? formState.banner : (formState.banner || ""),
          // Optional fields
          ...(formState.displayOrder && { displayOrder: parseInt(formState.displayOrder) }),
          ...(formState.seoMetaData && { seoMetaData: formState.seoMetaData }),
          ...(formState.createdBy && { createdBy: formState.createdBy }),
          ...(formState.updatedBy && { updatedBy: formState.updatedBy }),
        };

        let response;
        if (isEditMode && initialData?.specialityID) {
          // Update existing speciality
          response = await updateSpeciality(initialData.specialityID, submitData);
          toast.success("Speciality updated successfully!");
        } else {
          // Create new speciality
          response = await createSpeciality(submitData);
          toast.success("Speciality created successfully!");
        }

        console.log("API Response:", response);
        onClose(); // Close the form after successful submission
      } catch (error) {
        console.error("Error submitting form:", error);
        const errorMessage = error.response?.data?.message || "Failed to save speciality. Please try again.";
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log("Form has errors:", newErrors);
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <Breadcrumbs
        mainTitle={isEditMode ? "Edit Speciality" : "Add Speciality"}
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
                      <Label className="form-label" for="specialityName">
                        Speciality Name
                      </Label>
                      <Input
                        type="text"
                        name="specialityName"
                        id="specialityName"
                        value={formState.specialityName}
                        onChange={handleChange}
                        placeholder="Enter speciality name"
                        invalid={!!formErrors.specialityName}
                      />
                      <ValidationAlert error={formErrors.specialityName} />
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
                       {formState.icon && !(formState.icon instanceof File) && (
                         <small className="text-muted">Current: {formState.icon}</small>
                       )}
                       <small className="text-info">Note: Only file names are stored. For actual file uploads, implement file upload service.</small>
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
                      <Label className="form-label" for="doctor">
                        Assign Doctor
                      </Label>
                      <Input
                        type="select"
                        name="doctor"
                        id="doctor"
                        className="form-control digits"
                        value={formState.doctor}
                        onChange={handleChange}
                        invalid={!!formErrors.doctor}
                      >
                        <option value="">Select doctor</option>
                        {doctors.map((doctor, index) => (
                          <option key={index} value={doctor.doctorID}>
                            {doctor.fullName}
                          </option>
                        ))}
                      </Input>
                      <ValidationAlert error={formErrors.doctor} />
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
                       <Label className="form-label" for="banner">
                         Page Banner
                       </Label>
                       <Input
                         type="file"
                         name="banner"
                         id="banner"
                         onChange={handleChange}
                         placeholder="Enter Page Banner"
                         invalid={!!formErrors.banner}
                       />
                       {formState.banner && !(formState.banner instanceof File) && (
                         <small className="text-muted">Current: {formState.banner}</small>
                       )}
                       <small className="text-info">Note: Only file names are stored. For actual file uploads, implement file upload service.</small>
                       <ValidationAlert error={formErrors.banner} />
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
                      <Label className="form-label" for="seoMetaData">
                        SEO Metadata
                      </Label>
                      <Input
                        type="text"
                        name="seoMetaData"
                        id="seoMetaData"
                        value={formState.seoMetaData}
                        onChange={handleChange}
                        placeholder="Enter SEO metadata (comma separated)"
                        invalid={!!formErrors.seoMetaData}
                      />
                      <ValidationAlert error={formErrors.seoMetaData} />
                    </Col>
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
                    <Col md="6 mb-3">
                      <Label className="form-label">
                        Display in Navigation Menu
                      </Label>
                      <Input
                        type="select"
                        name="isNavigationDisplay"
                        value={formState.isNavigationDisplay ? "Yes" : "No"}
                        onChange={handleRadioChange}
                        invalid={!!formErrors.isNavigationDisplay}
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </Input>
                      <ValidationAlert error={formErrors.isNavigationDisplay} />
                    </Col>
                    <Col md="6 mb-3">
                      <Label className="form-label" for="isActive">
                        Active Status
                      </Label>
                      <Input
                        type="select"
                        name="isActive"
                        id="isActive"
                        className="form-control digits"
                        value={formState.isActive ? "Active" : "Inactive"}
                        onChange={(e) => setFormState(prev => ({ ...prev, isActive: e.target.value === "Active" }))}
                        invalid={!!formErrors.isActive}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </Input>
                      <ValidationAlert error={formErrors.isActive} />
                    </Col>
                  </Row>
                  <Button
                    type="submit"
                    color="primary"
                    disabled={isSubmitting}
                    className="w-100"
                  >
                    {isSubmitting ? "Saving..." : isEditMode ? "Update Speciality" : "Create Speciality"}
                  </Button>
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
