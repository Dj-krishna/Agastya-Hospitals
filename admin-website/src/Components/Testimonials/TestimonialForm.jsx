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
import { toasterConfig } from "../../utils";
import axios from "axios";
import Switch from "react-switch";

const initialFormState = {
  name: "",
  place: "",
  userPhoto: "",
  type: "",
  description: "",
  videoUpload: "",
};

const initialFormErrors = {
  name: "",
  place: "",
  userPhoto: "",
  type: "",
  description: "",
  videoUpload: "",
};
const TestimonialForm = ({
  isEditMode,
  onClose,
  testimonialID = "",
  testimonialToEdit,
  fetchTestimonials,
}) => {
  const [formState, setFormState] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState(initialFormErrors);

  useState(() => {
    if (isEditMode && testimonialToEdit) {
      setFormState({
        name: testimonialToEdit.name || "",
        place: testimonialToEdit.place || "",
        userPhoto: testimonialToEdit.userPhoto || "",
        type: testimonialToEdit.type || "",
        description: testimonialToEdit.description || "",
        videoUpload: testimonialToEdit.videoUpload || "",
      });
    }
  }, [isEditMode, testimonialToEdit]);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    let fieldValue = value;

    if (type === "file") {
      if (name === "userPhoto" && files && files[0]) {
        fieldValue = URL.createObjectURL(files[0]);
      } else if (name === "videoUpload" && files && files[0]) {
        fieldValue = URL.createObjectURL(files[0]);
      }
    }

    setFormState({
      ...formState,
      [name]: fieldValue,
    });
  };

  const isFormValid = Object.values(formState).every(
    (val) => val !== null && val !== "" && val !== undefined
  );

  const validateField = (name, value, formState) => {
    if (name === "name" || name === "place") {
      return value.trim() === "" ? "This field is required" : "";
    }
    if (name === "userPhoto") {
      return value === "" ? "User photo is required" : "";
    }
    if (name === "type") {
      return value === "" ? "Please select type" : "";
    }
    if (name === "description" && formState.type === "text") {
      return value.trim() === "" ? "Description is required" : "";
    }
    if (name === "videoUpload" && formState.type === "video") {
      return value === "" ? "Video file is required" : "";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    Object.keys(formState).forEach((key) => {
      errors[key] =
        key !== "videoUpload" && validateField(key, formState[key], formState);
    });
    setFormErrors(errors);

    const hasError = Object.values(errors).some((err) => err);
    if (hasError) return;

    const formData = new FormData();
    formData.append("name", formState.name);
    formData.append("place", formState.place);
    formData.append("description", formState.description);
    formData.append("type", formState.type);

    formData.append("userPhoto", formState.userPhoto);

    formData.append("videoUpload", formState.videoUpload);

    formData.append("createdBy", "user");
    formData.append("youtubeLink", formState.youtubeLink || "");

    try {
      let response;
      if (isEditMode) {
        // Replace testimonialID with the actual ID you want to update
        response = await axios.put(
          `https://agastya-hospitals-0bfo.onrender.com/api/testimonials?testimonialID=${testimonialID}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await axios.post(
          "https://agastya-hospitals-0bfo.onrender.com/api/testimonials",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
      if (response.status === 200 || response.status === 201) {
        fetchTestimonials();
        toasterConfig(
          "success",
          isEditMode
            ? "Testimonial updated successfully"
            : response.data.message
        );
        onClose();
      }
    } catch (error) {
      // handle error (e.g., show error message)
      toasterConfig("error", "There was an error submitting the testimonial");
    }
  };

  return (
    <>
      <Breadcrumbs
        mainTitle={isEditMode ? "Edit Testimonial" : "Add Testimonial"}
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
                  onSubmit={handleSubmit}
                >
                  <Row>
                    <Col md="6" className="mb-3">
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
                        // invalid={!!formErrors.name}
                      />
                      {/* <ValidationAlert error={formErrors.name} /> */}
                    </Col>
                    <Col md="6" className="mb-3">
                      <Label className="form-label" for="place">
                        Place
                      </Label>
                      <Input
                        type="text"
                        name="place"
                        id="place"
                        value={formState.place}
                        onChange={handleChange}
                        placeholder="Enter place"
                        // invalid={!!formErrors.place}
                      />
                      {/* <ValidationAlert error={formErrors.place} /> */}
                    </Col>
                    <Col md="6" className="mb-3">
                      <Label className="form-label" for="userPhoto">
                        User Photo
                      </Label>
                      <Input
                        type="file"
                        name="userPhoto"
                        id="userPhoto"
                        //value={formState.userPhoto}
                        onChange={handleChange}
                        placeholder="Enter user photo"
                        //invalid={!!formErrors.userPhoto}
                      />
                      {/* <ValidationAlert error={formErrors.userPhoto} /> */}
                    </Col>
                    <Col md="6" className="mb-3">
                      {formState.userPhoto ? (
                        <>
                          <Label className="form-label" for="userphotoPreview">
                            Preview
                          </Label>
                          <div>
                            <img
                              src={formState.userPhoto}
                              style={{ objectFit: "contain", height: "8rem" }}
                            />
                          </div>
                        </>
                      ) : (
                        <div
                          className="bg-light text-white rounded d-flex align-items-center justify-content-center mb-3 f-800"
                          style={{ width: "8rem", height: "8rem" }}
                        >
                          <p>PREVIEW</p>
                        </div>
                      )}
                    </Col>
                    <Col md="12" className="mb-3">
                      <Label className="form-label" for="description">
                        Description
                      </Label>
                      <Input
                        type="textarea"
                        name="description"
                        id="description"
                        value={formState.description}
                        onChange={handleChange}
                        placeholder="Enter description"
                        invalid={!!formErrors.description}
                      />
                      <ValidationAlert error={formErrors.description} />
                    </Col>
                    <Col md="6" className="mb-3 d-flex align-items-center">
                      {/* <Label className="form-label" for="type">
                        Type
                      </Label>
                      <select
                        className="form-control"
                        name="type"
                        id="type"
                        value={formState.type}
                        onChange={handleChange}
                      >
                        <option value="">Select type</option>
                        <option value="video">Video</option>
                        <option value="text">Text</option>
                      </select>
                      <ValidationAlert error={formErrors.type} /> */}
                      <span className="me-2 f-w-700 f-18">Is Video Enabled?</span>
                      <Switch
                        onChange={() =>
                          setFormState({
                            ...formState,
                            type: formState.type === "video" ? "text" : "video",
                          })
                        }
                        checked={formState.type === "video"}
                      />
                    </Col>

                    {/* {formState.type === "text" && (
                      <Col md="12" className="mb-3">
                        <Label className="form-label" for="description">
                          Description
                        </Label>
                        <Input
                          type="textarea"
                          name="description"
                          id="description"
                          value={formState.description}
                          onChange={handleChange}
                          placeholder="Enter description"
                          invalid={!!formErrors.description}
                        />
                        <ValidationAlert error={formErrors.description} />
                      </Col>
                    )} */}

                    {formState.type === "video" && (
                      <Col md="12" className="mb-3">
                        <Label className="form-label" for="videoUpload">
                          Upload Video
                        </Label>
                        <Input
                          type="file"
                          name="videoUpload"
                          id="videoUpload"
                          accept="video/*"
                          onChange={handleChange}
                        />
                        {formState.videoUpload && (
                          <video
                            width="320"
                            height="240"
                            controls
                            style={{ marginTop: "1rem" }}
                            src={formState.videoUpload}
                          />
                        )}
                        <ValidationAlert error={formErrors.videoUpload} />
                      </Col>
                    )}
                  </Row>
                  <Row>
                    <Col md="12" className="text-center">
                      <button
                        className="btn btn-primary"
                        type="submit"
                        // disabled={!isFormValid}
                      >
                        {isEditMode ? "Update" : "Submit"}
                      </button>
                      <button
                        className="btn btn-secondary ms-2"
                        type="button"
                        disabled={isFormValid}
                        onClick={() => {
                          setFormState(initialFormState);
                          setFormErrors(initialFormErrors);
                        }}
                      >
                        Reset
                      </button>
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

export default TestimonialForm;
