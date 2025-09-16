import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Label, Input, Col } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import ValidationAlert from "../Common/Component/ValidationAlert";
import { fetchSpecialities } from "../../api/Services";
import { fetchSpecialties } from "../../slices/specialtySlice";

const initialState = {
  technologyName: "",
  icon: null,
  specialityName: "",
};

const TechnologiesForm = ({ onSubmit, isEditMode, initialData }) => {
  const [formState, setFormState] = useState(initialData || initialState);
  const [formErrors, setFormErrors] = useState({});
  const dispatch = useDispatch();
//   const { specialties, loading: isLoading } = useSelector(
//     (state) => state.specialties
//   );

//   useEffect(() => {
//     dispatch(fetchSpecialties());
//   }, [dispatch]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    Object.keys(formState).forEach((key) => {
      errors[key] = validateField(key, formState[key]);
    });
    setFormErrors(errors);
    const isValid = Object.values(errors).every((msg) => msg === "");
    if (isValid && onSubmit) {
      onSubmit(formState);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="needs-validation" noValidate>
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
          {formState.icon && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(formState.icon)}
                alt="Icon Preview"
                style={{ maxWidth: 60, maxHeight: 60, borderRadius: 8 }}
              />
            </div>
          )}
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label for="specialityName" sm={3} className="form-label">
          Specialty
        </Label>
        <Col sm={9}>
          <Input
            type="select"
            name="specialityName"
            id="specialityName"
            value={formState.specialty}
            onChange={handleChange}
            invalid={!!formErrors.specialty}
          >
            <option value="">Select specialty</option>
            {/* {specialties.data &&
              specialties.data?.map((spec) => (
                <option key={spec.specialityName} value={spec.specialityName}>
                  {spec.specialityName}
                </option>
              ))} */}
          </Input>
          <ValidationAlert error={formErrors.specialityName} />
        </Col>
      </FormGroup>
      <div className="text-end">
        <Button color="primary" type="submit">
          {isEditMode ? "Update Technology" : "Add Technology"}
        </Button>
      </div>
    </Form>
  );
};

export default TechnologiesForm;
