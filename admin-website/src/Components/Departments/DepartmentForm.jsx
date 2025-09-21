import React, { useEffect, useState } from "react";
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
import { useDispatch } from "react-redux";
import {
  createDepartment,
  fetchDepartments,
  updateDepartment,
} from "../../slices/departmentSlice";
import { toasterConfig } from "../../utils";

const initialFormState = { departmentName: "" };
const DepartmentForm = ({ isEditMode, onClose, initialData, isOpen }) => {
  const [formState, setFormState] = useState(initialFormState);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    setFormState(initialData);
  }, [initialData]);

  const addDepartment = async (data) => {
    try {
      const response = await dispatch(createDepartment(data));
      if (response.payload.inserted.length > 0) {
        dispatch(fetchDepartments());
        onClose();
        toasterConfig("success", "Department add successfully!");
      }
    } catch {
      onClose();
      toasterConfig("error", "Something wrong!");
    }
  };
  const handleUpdateDepartment = async (departID, data) => {
    try {
      const response = await dispatch(
        updateDepartment({
          id: departID,
          departmentData: { departmentName: data.departmentName },
        })
      );
      if (response.payload.message) {
        onClose();
        dispatch(fetchDepartments());
        toasterConfig("success", "Department updated successfully!");
      }
    } catch {
      onClose();
      toasterConfig("error", "Something wrong!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.departmentName || formState.departmentName.trim() === "") {
      setError("Department Name is required");
      return;
    }
    setError("");
    if (isEditMode) {
      handleUpdateDepartment(initialData.departmentID, formState);
    } else {
      addDepartment(formState);
    }
    setFormState({});
  };

  return (
    <ModelComponent
      isOpen={isOpen}
      title={isEditMode ? "Edit Department" : "Add Department"}
      toggler={onClose}
      //   submitBtnText={isEditMode ? "Update Department" : "Add Department"}
      closeBtnText={"Cancel"}
      //   onSubmit={handleSubmit}
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
                        Department Name
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
                    <Col md={12} className="d-flex justify-end">
                      <Button type="button" onClick={onClose}>
                        Cancel
                      </Button>
                      &nbsp;&nbsp;&nbsp;
                      <Button type="submit" color="primary">
                        Submit
                      </Button>
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
