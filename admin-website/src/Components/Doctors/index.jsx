import React, { Fragment, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  CardImg,
} from "reactstrap";
import { Breadcrumbs } from "../../AbstractElements";
import AllCards from "./AllCards";
import DoctorForm from "./DoctorForm";

const Doctors = () => {
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddDoctor = () => {
    setEditingDoctor(null);
    setIsEditMode(false);
    setShowDoctorForm(true);
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setIsEditMode(true);
    setShowDoctorForm(true);
  };

  const handleCloseForm = () => {
    setShowDoctorForm(false);
    setEditingDoctor(null);
    setIsEditMode(false);
    // Trigger refresh of doctor cards
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Fragment>
      {!showDoctorForm ? (
        <>
          <Breadcrumbs
            mainTitle="Doctors"
            buttonTitle={"Add Doctor"}
            onClick={handleAddDoctor}
          />

          <Container fluid={true}>
            <Row className="widget-grid">
              <AllCards 
                onEditDoctor={handleEditDoctor} 
                refreshTrigger={refreshTrigger}
              />
            </Row>
          </Container>
        </>
      ) : (
        <DoctorForm 
          onClose={handleCloseForm}
          initialData={editingDoctor}
          isEditMode={isEditMode}
        />
      )}
    </Fragment>
  );
};

export default Doctors;
