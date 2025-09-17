import React, { Fragment, useEffect, useState } from "react";
import { Breadcrumbs } from "../../AbstractElements";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import TechnologiesForm from "./TechnologiesForm";
import { useDispatch, useSelector } from "react-redux";
import { fetchTechnologies } from "../../slices/technologiesSlice";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { TECHNOLOGIES_API } from "../../api";
import axios from "axios";
import { toasterConfig } from "../../utils";
import ConfirmationAlert from "../Common/Component/ConfirmationAlert";
import TableComponent from "../Common/Component/TableComponent";

const Technologies = () => {
  const [showTechForm, setShowTechForm] = useState(false);
  const [techData, setTechData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [techId, setTechId] = useState("");
  const [searchText, setSearchText] = useState("");

  const dispatch = useDispatch();
  const { technologies, loading, error } = useSelector((state) => {
    console.log("STATE::: ", state);
    return state;
  });

  useEffect(() => {
    // Dispatch action to fetch technologies
    dispatch(fetchTechnologies());
  }, [dispatch]);

  const editTechnology = (data) => {
    setTechData(data);
    setIsEditMode(true);
    setShowTechForm(true);
  };

  const deleteTechData = async (id) => {
    try {
      const response = await axios.delete(
        `${TECHNOLOGIES_API}?technologyID=${id}`
      );
      if (response) {
        dispatch(fetchTechnologies());
        toasterConfig("success", "Technology is deleted successfully");
        setIsDeleteConfirmOpen(false);
      }
    } catch (error) {
      console.error("Error deleting technology:", error);
    }
  };
  const filteredTechnologies = technologies.items.data?.length >0
    ? technologies.items.data.filter(
        (tech) =>
          tech.technologyName
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          tech.speciality.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];
  return (
    <Fragment>
      <Breadcrumbs
        mainTitle={showTechForm ? "Add Technology" : "Technologies"}
        buttonTitle={showTechForm ? "Cancel" : "Add Technology"}
        onClick={() => {
          setShowTechForm(showTechForm ? false : true);
          setIsEditMode(false);
          setTechData(null);
        }}
        btnColor={showTechForm ? "danger" : "primary"}
      />

      {!showTechForm ? (
        <Container fluid={true}>
          <Row className="widget-grid">
            <Col lg="12" md="12" sm="12" xs="12">
              <TableComponent
                isSearch={true}
                searchText={searchText}
                onSearch={(e) => setSearchText(e.target.value)}
                headers={["Icon", "Name", "Speciality", "Action"]}
                tableBody={
                  <tbody>
                    {filteredTechnologies?.map((tech) => (
                      <tr key={tech.technologyID}>
                        <td>
                          <img
                            src={tech.icon}
                            alt={tech.technologyName}
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                        </td>
                        <td>{tech.technologyName}</td>
                        <td>{tech.speciality}</td>
                        <td>
                          <div className="d-flex  align-items-center">
                            <FaPencilAlt
                              color="#7366ff"
                              onClick={() => editTechnology(tech)}
                              className="me-2 text-primary cursor-pointer"
                              title="Edit Technology"
                            />
                            &nbsp;&nbsp;<span className="text-muted">|</span>
                            &nbsp;&nbsp;
                            <FaTrashAlt
                              onClick={() => {
                                setTechId(tech.technologyID);
                                setIsDeleteConfirmOpen(true);
                              }}
                              className="text-danger cursor-pointer"
                              title="Delete Technology"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                }
              />
            </Col>
          </Row>
        </Container>
      ) : (
        <TechnologiesForm
          initialData={techData}
          isEditMode={isEditMode}
          onClose={() => setShowTechForm(false)}
        />
      )}
      <ConfirmationAlert
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        handleConfirm={() => deleteTechData(techId)}
      />
    </Fragment>
  );
};

export default Technologies;
