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
  return (
    <Fragment>
      {!showDoctorForm ? (
        <>
          <Breadcrumbs
            mainTitle="Doctors"
            buttonTitle={"Add Doctor"}
            onClick={() => setShowDoctorForm(true)}
          />

          <Container fluid={true}>
            <Row className="widget-grid">
              <AllCards />
            </Row>
          </Container>
        </>
      ) : (
        <DoctorForm onClose={() => setShowDoctorForm(false)} />
      )}
    </Fragment>
  );
};

export default Doctors;
