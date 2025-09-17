import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Col,
  Container,
  Row,
  Card,
  CardBody,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import ValidationAlert from "../Common/Component/ValidationAlert";
import { fetchSpecialties } from "../../slices/specialtySlice";
import { toasterConfig } from "../../utils";
import axios from "axios";
import { TECHNOLOGIES_API } from "../../api";
import { fetchTechnologies } from "../../slices/technologiesSlice";

const initialState = {
  technologyName: "",
  icon: null,
  speciality: "",
};

const TechnologiesForm = ({ isEditMode, initialData, onClose }) => {
  const [formState, setFormState] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const dispatch = useDispatch();
  const { specialties, loading, error } = useSelector((state) => {
    return state.specialties;
  });

  useEffect(() => {
    dispatch(fetchSpecialties());
  }, [dispatch]);

  useEffect(() => {
    if (isEditMode && initialData) {
      setFormState({
        technologyName: initialData.technologyName || "",
        icon: initialData.icon || null,
        speciality: initialData.speciality || "",
      });
    }
  }, [isEditMode, initialData]);

  console.log("SPECIALTIES DATA ", initialData, formState);

  const validateField = (name, value) => {
    if (!value || (typeof value === "string" && value.trim() === "")) {
      return "This field is required";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "icon") {
      setFormState((prev) => ({ ...prev, icon: files[0] }));
      setFormErrors((prev) => ({
        ...prev,
        icon: files[0] ? "" : "Icon is required",
      }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
      setFormErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const createTechnology = async (technologyData) => {
    try {
      const formData = formState;
      Object.keys(technologyData).forEach((key) => {
        if (technologyData[key] !== null && technologyData[key] !== undefined) {
          if (key === "icon" && technologyData[key] instanceof File) {
            formData[key] = technologyData[key];
          } else if (Array.isArray(technologyData[key])) {
            formData[key] = JSON.stringify(technologyData[key]);
          } else {
            formData[key] = technologyData[key];
          }
        }
      });

      const response = await axios.post(TECHNOLOGIES_API, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating technology:", error);
      throw error;
    }
  };

  const updateTechnology = async (id, technologyData) => {
    try {
      const formData = formState;
      Object.keys(technologyData).forEach((key) => {
        if (technologyData[key] !== null && technologyData[key] !== undefined) {
          if (key === "icon" && technologyData[key] instanceof File) {
            formData[key] = technologyData[key];
          } else if (Array.isArray(technologyData[key])) {
            formData[key] = JSON.stringify(technologyData[key]);
          } else {
            formData[key] = technologyData[key];
          }
        }
      });

      const response = await axios.put(
        `${TECHNOLOGIES_API}?technologyID=${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating technology:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    Object.keys(formState).forEach((key) => {
      errors[key] = validateField(key, formState[key]);
    });
    setFormErrors(errors);
    const isValid = Object.values(errors).every((msg) => msg === "");
    if (isValid) {
      //   setIsLoading(true);
      try {
        const formData = formState;
        Object.entries(formState).forEach(([key, value]) => {
          if (key === "icon" && value && typeof value !== "string") {
            formData[key] = value;
          } else {
            formData[key] = value;
          }
        });

        let response;
        if (isEditMode && initialData?.technologyID) {
          response = await updateTechnology(initialData.technologyID, formData);
        } else {
          response = await createTechnology(formData);
        }
        dispatch(fetchTechnologies());
        onClose();
        toasterConfig(
          "success",
          isEditMode ? "Technology is updated" : "Technology is added"
        );
      } catch (error) {
        toasterConfig("error", "Failed to save technology");
        console.error("Error saving technology:", error);
      } finally {
        // setIsLoading(false);
      }
    }
  };

  return (
    <Container fluid={true}>
      <Row>
        <Col sm="12">
          <Card>
            <CardBody>
              <Form
                onSubmit={handleSubmit}
                className="needs-validation"
                noValidate
              >
                <FormGroup row>
                  <Label for="technologyName" sm={3} className="form-label">
                    Technology Name
                  </Label>
                  <Col sm={9}>
                    <Input
                      type="text"
                      name="technologyName"
                      id="technologyName"
                      value={formState.technologyName}
                      onChange={handleChange}
                      placeholder="Enter technology name"
                      invalid={!!formErrors.technologyName}
                    />
                    <ValidationAlert error={formErrors.technologyName} />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="icon" sm={3} className="form-label">
                    Icon
                  </Label>
                  <Col sm={9}>
                    <Input
                      type="file"
                      name="icon"
                      id="icon"
                      accept="image/*"
                      onChange={handleChange}
                      invalid={!!formErrors.icon}
                    />
                    <ValidationAlert error={formErrors.icon} />
                    {/* {formState.icon && (
                      <div className="mt-2">
                        <img
                          src={formState.icon}
                          alt="Icon Preview"
                          style={{
                            maxWidth: 60,
                            maxHeight: 60,
                            borderRadius: 8,
                          }}
                        />
                      </div>
                    )} */}
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="speciality" sm={3} className="form-label">
                    Specialty
                  </Label>
                  <Col sm={9}>
                    <Input
                      type="select"
                      name="speciality"
                      id="speciality"
                      value={formState.speciality}
                      onChange={handleChange}
                      invalid={!!formErrors.speciality}
                    >
                      <option value="">Select specialty</option>
                      {specialties.data?.length > 0 &&
                        specialties.data?.map((spec) => (
                          <option
                            key={spec.specialityName}
                            value={spec.specialityName}
                          >
                            {spec.specialityName}
                          </option>
                        ))}
                    </Input>
                    <ValidationAlert error={formErrors.speciality} />
                  </Col>
                </FormGroup>
                <div className="text-end">
                  <Button color="primary" type="submit">
                    {isEditMode ? "Update Technology" : "Add Technology"}
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TechnologiesForm;
