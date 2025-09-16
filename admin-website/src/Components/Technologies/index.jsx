import React, { Fragment, useEffect, useState } from "react";
import { Breadcrumbs } from "../../AbstractElements";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import TechnologiesForm from "./TechnologiesForm";
import { useDispatch, useSelector } from "react-redux";
import { fetchTechnologies } from "../../slices/technologiesSlice";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";

const Technologies = () => {
  const [showTechForm, setShowTechForm] = useState(false);
  const dispatch = useDispatch();
  const { technologies, loading, error } = useSelector((state) => {
    console.log("STATE::: ", state);
    return state;
  });

  useEffect(() => {
    // Dispatch action to fetch technologies
    dispatch(fetchTechnologies());
  }, [dispatch]);

  console.log("TECHNOLOGIES DATA ", technologies.items);

  return (
    <Fragment>
      <Breadcrumbs
        mainTitle={showTechForm ? "Add Technology" : "Technologies"}
        buttonTitle={showTechForm ? "Cancel" : "Add Technology"}
        onClick={() => setShowTechForm(!showTechForm)}
      />

      {!showTechForm ? (
        <Container fluid={true}>
          <Row className="widget-grid">
            {technologies.items.data?.map((tech) => (
              <Col lg="4" md="4" sm="6" xs="12" key={tech._id}>
                <Card>
                  <img
                    src={tech.icon}
                    className="card-img-top p-2 rounded-4 border-1"
                    alt="Blog"
                    style={{ height: "150px", objectFit: "cover" }}
                  />
                  <CardBody>
                    <h5
                      className="card-title"
                      style={{
                        display: "inline-block",
                        maxWidth: "100%",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        verticalAlign: "bottom",
                      }}
                      title={tech.technologyName}
                    >
                      {tech.technologyName}
                    </h5>
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="text-muted f-12">{tech.speciality}</p>
                      <div className="d-flex justify-content-end align-items-center">
                        <FaPencilAlt
                          color="#7366ff"
                          //onClick={() => handleEditSpeciality(item)}
                          className="me-2 text-primary cursor-pointer"
                          title="Edit Speciality"
                        />
                        &nbsp;&nbsp;<span className="text-muted">|</span>
                        &nbsp;&nbsp;
                        <FaTrashAlt
                          //onClick={() => handleDeleteSpeciality(item)}
                          className="text-danger cursor-pointer"
                          title="Delete Speciality"
                        />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      ) : (
        <TechnologiesForm
        // editingUserRole={editingUserRole}
        // isEditMode={isEditMode}
        // onClose={handleCloseForm}
        />
      )}
    </Fragment>
  );
};

export default Technologies;
