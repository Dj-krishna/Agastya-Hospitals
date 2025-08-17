import React, { Fragment } from "react";
import { Breadcrumbs } from "../../AbstractElements";
import { Container, Row } from "reactstrap";

const MedicalRecords = () => {
  return (
    <Fragment>
      <>
        <Breadcrumbs mainTitle={"Medical Records"} />

        <Container fluid={true}>
          <Row className="widget-grid"></Row>
        </Container>
      </>
    </Fragment>
  );
};

export default MedicalRecords;
