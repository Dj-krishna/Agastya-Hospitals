import React, { Fragment, useState } from "react";
import { Breadcrumbs } from "../../AbstractElements";
import { Container, Row } from "reactstrap";
import SpecialityForm from "./SpecialityForm";

const Specialities = () => {
  const [showSpecialityForm, setSpecialityForm] = useState(true);
  return (
    <Fragment>
      {!showSpecialityForm ? (
        <>
          <Breadcrumbs
            mainTitle="Specialities"
            buttonTitle={"Add Speciality"}
            onClick={() => setSpecialityForm(true)}
          />

          <Container fluid={true}>
            <Row className="widget-grid">
              
            </Row>
          </Container>
        </>
      ) : (
        <SpecialityForm onClose={() => setSpecialityForm(false)} />
      )}
    </Fragment>
  );
};

export default Specialities;
