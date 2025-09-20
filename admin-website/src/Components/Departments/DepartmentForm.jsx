import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import ModelComponent from "../Common/Component/ModelComponent";
import ValidationAlert from "../Common/Component/ValidationAlert";
const initialFormState = { departmentName: "" };
const DepartmentForm = ({ isEditMode, onClose, initialData, isOpen }) => {
  const [formState, setFormState] = useState(initialData || initialFormState);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.departmentName || formState.departmentName.trim() === "") {
      setError("Department Name is required");
      return;
    }
    setError("");
  };

  return (
    <ModelComponent
      isOpen={isOpen}
      title={isEditMode ? "Edit Department" : "Add Department"}
      toggler={onClose}
      submitBtnText={isEditMode ? "Update Department" : "Add Department"}
      closeBtnText={"Cancel"}
      onSubmit={handleSubmit}
      size="md"
      bodyClass="p-0"
      children={
        <Row>
          <Col sm="12" md="12" xs="12" lg="12">
            <Card>
              <CardBody>
                <Form onSubmit={handleSubmit} className="needs-validation">
                  <Row>
                    <Col md="12" className="mb-3">
                      <Label className="form-label" for="departmentName">
                        Department Name *
                      </Label>
                      <Input
                        type="text"
                        name="departmentName"
                        id="departmentName"
                        value={formState?.departmentName}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            departmentName: e.target.value,
                          })
                        }
                        placeholder="Enter department name"
                        invalid={error ? true : false}
                      />
                      <ValidationAlert message={error} />
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      }
    />
  );
};

export default DepartmentForm;
