import React, { Fragment, useEffect, useState } from "react";
import HealthPackagesForm from "./HealthPackagesForm";
import { Breadcrumbs } from "../../AbstractElements";
import { Col, Container, Row } from "reactstrap";
import TableComponent from "../Common/Component/TableComponent";
import { FaPencilAlt, FaPencilRuler, FaTrashAlt } from "react-icons/fa";
import { fetchDataGet } from "../../api/Services";
import { HEALTH_PACKAGES_API } from "../../api";

const HealthPackages = () => {
  const [showHealthPackageForm, setShowHealthPackageForm] = useState(false);
  const [healthPackageData, setHealthPackageData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHealthPackages = async () => {
    try {
      setLoading(true);
      const data = await fetchDataGet(HEALTH_PACKAGES_API);
      setHealthPackageData(data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchHealthPackages();
  }, []);

  const handleAddHealthPackage = () => {
    setShowHealthPackageForm(!showHealthPackageForm);
  };

  if (loading) {
    return (
      <Col xs="12">
        <div className="text-center p-4">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </Col>
    );
  }
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
                headers={[
                  "Package Name",
                  "Price",
                  "Discount Type",
                  "Discount Amount",
                  "Discount Price",
                  "Actions",
                ]}
                tableBody={
                  <tbody>
                    {healthPackageData.map((data, index) => (
                      <tr key={index}>
                        <td>{data.packageName}</td>
                        <td>Rs. {data.price}/-</td>
                        <td>{data.discountType}</td>
                        <td>
                          {data.discountType === "Percentage" ? "" : "Rs. "}
                          {data.discountAmount}
                          {data.discountType === "Percentage" ? "%" : "/-"}
                        </td>
                        <td>Rs. {data.discountPrice}/-</td>
                        <td>
                          <FaPencilAlt color="#7366ff" />
                          &nbsp;&nbsp;<span className="text-muted">|</span>
                          &nbsp;&nbsp;
                          <FaTrashAlt color="#fc4438" />
                        </td>
                      </tr>
                    ))}
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
