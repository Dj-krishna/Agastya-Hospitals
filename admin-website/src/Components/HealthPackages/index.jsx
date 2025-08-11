import React, { Fragment, useState } from "react";
import HealthPackagesForm from "./HealthPackagesForm";
import { Breadcrumbs } from "../../AbstractElements";
import { Container, Row } from "reactstrap";
import TableComponent from "../Common/Component/TableComponent";
import { FaPencilAlt, FaPencilRuler, FaTrashAlt } from "react-icons/fa";

const HealthPackages = () => {
  const [showHealthPackageForm, setShowHealthPackageForm] = useState(false);

  const handleAddHealthPackage = () => {
    setShowHealthPackageForm(!showHealthPackageForm);
  };
  return (
    <Fragment>
      {!showHealthPackageForm ? (
        <>
          <Breadcrumbs
            mainTitle="Health Packages"
            buttonTitle={"Add Health Package"}
            onClick={handleAddHealthPackage}
          />
          <Container fluid={true}>
            <Row className="widget-grid">
              <TableComponent
                headers={["Package Name", "Price", "Actions"]}
                tableBody={
                  <tbody>
                    <tr>
                      <td>Basic Health Checkup</td>
                      <td>$50</td>
                      <td>
                        <FaPencilAlt color="#7366ff" />
                        &nbsp;&nbsp;<span className="text-muted">|</span>
                        &nbsp;&nbsp;
                        <FaTrashAlt color="#fc4438" />
                      </td>
                    </tr>
                    <tr>
                      <td>Comprehensive Health Checkup</td>
                      <td>$100</td>
                      <td>
                        <FaPencilAlt color="#7366ff" />
                        &nbsp;&nbsp;<span className="text-muted">|</span>
                        &nbsp;&nbsp;
                        <FaTrashAlt color="#fc4438" />
                      </td>
                    </tr>
                    <tr>
                      <td>Senior Citizen Health Checkup</td>
                      <td>$75</td>
                      <td>
                        <FaPencilAlt color="#7366ff" />
                        &nbsp;&nbsp;<span className="text-muted">|</span>
                        &nbsp;&nbsp;
                        <FaTrashAlt color="#fc4438" />
                      </td>
                    </tr>
                  </tbody>
                }
              />
            </Row>
          </Container>
        </>
      ) : (
        <HealthPackagesForm onClose={handleAddHealthPackage} />
      )}
    </Fragment>
  );
};

export default HealthPackages;
