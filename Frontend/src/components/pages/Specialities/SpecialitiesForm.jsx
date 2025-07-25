import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";

const mockDoctors = [
  { id: 1, name: "Dr. John Doe" },
  { id: 2, name: "Dr. Jane Smith" },
  { id: 3, name: "Dr. Emily Johnson" },
];

const SpecialitiesForm = ({ show, handleClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
    handleClose();
  };

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      <Row className="m-0">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Speciality Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter speciality name"
              {...register("specialityName", {
                required: "Speciality name is required",
                minLength: {
                  value: 2,
                  message: "Speciality name must be at least 2 characters",
                },
              })}
              isInvalid={!!errors.specialityName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.specialityName?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Icon</Form.Label>
            <Form.Control
              type="file"
              {...register("icon", {
                required: "Icon is required",
              })}
              isInvalid={!!errors.icon}
            />
            <Form.Control.Feedback type="invalid">
              {errors.icon?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Display Order in Home page</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter display order"
              {...register("displayOrder", {
                required: "Display order is required",
                min: {
                  value: 1,
                  message: "Display order must be at least 1",
                },
              })}
              isInvalid={!!errors.displayOrder}
            />
            <Form.Control.Feedback type="invalid">
              {errors.displayOrder?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3 mx-0">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Assign Doctor</Form.Label>
            <Form.Select
              {...register("doctor", {
                required: "Please assign a doctor",
              })}
              isInvalid={!!errors.doctor}
            >
              <option value="">Select Doctor</option>
              {mockDoctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  <label>
                    <Form.Check type="checkbox" />
                    {doctor.name}
                  </label>
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.doctor?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Page Banner</Form.Label>
            <Form.Control
              type="file"
              {...register("pageBanner", {
                required: "Page banner is required",
              })}
              isInvalid={!!errors.pageBanner}
            />
            <Form.Control.Feedback type="invalid">
              {errors.pageBanner?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>URL Slug</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter URL slug"
              {...register("urlSlug", {
                required: "URL slug is required",
                pattern: {
                  value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                  message: "Slug must be lowercase and hyphen-separated",
                },
              })}
              isInvalid={!!errors.urlSlug}
            />
            <Form.Control.Feedback type="invalid">
              {errors.urlSlug?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3 mx-0">
        <Col md={6}>
          <Form.Group>
            <Form.Label>
              Short Description on the Card of home page carousel
            </Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Enter short description"
              {...register("shortDescription", {
                required: "Short description is required",
                maxLength: {
                  value: 150,
                  message: "Short description must be under 150 characters",
                },
              })}
              isInvalid={!!errors.shortDescription}
            />
            <Form.Control.Feedback type="invalid">
              {errors.shortDescription?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>SEO Keywords, Meta etc...</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Enter SEO Keywords, Meta etc..."
              {...register("seo", {
                required: "SEO keywords/meta are required",
              })}
              isInvalid={!!errors.seo}
            />
            <Form.Control.Feedback type="invalid">
              {errors.seo?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3 mx-0">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Temporary deactivate (Hide in the website)</Form.Label>
            <Form.Select
              {...register("status", {
                required: "Status is required",
              })}
              isInvalid={!!errors.status}
            >
              <option value="">Select Status</option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.status?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Display in Navigation menu</Form.Label>
            <div className="pl-2">
              <Form.Check
                inline
                label="Yes"
                name="displayInNavMenu"
                type="radio"
                id="displayInNavMenu-yes"
                value="yes"
                {...register("displayInNavMenu", {
                  required: "Please select an option",
                })}
                isInvalid={!!errors.displayInNavMenu}
              />
              <Form.Check
                inline
                label="No"
                name="displayInNavMenu"
                type="radio"
                id="displayInNavMenu-no"
                value="no"
                {...register("displayInNavMenu")}
              />
              <Form.Control.Feedback
                type="invalid"
                style={{ display: "block" }}
              >
                {errors.displayInNavMenu?.message}
              </Form.Control.Feedback>
            </div>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3 mx-0">
        <Col md={12}>
          <Form.Group>
            <Form.Label>Page Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Enter page description..."
              {...register("pageDescription", {
                required: "Page description is required",
              })}
              isInvalid={!!errors.pageDescription}
            />
            <Form.Control.Feedback type="invalid">
              {errors.pageDescription?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3 mx-0">
        <Col md={12} className="d-flex justify-content-end gap-2">
          <Button variant="primary" type="submit">
            Add
          </Button>
          <Button variant="secondary" type="button" onClick={handleClose}>
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SpecialitiesForm;
