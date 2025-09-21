import React, { Fragment, useEffect, useState } from "react";
import HealthPackagesForm from "./HealthPackagesForm";
import { Breadcrumbs } from "../../AbstractElements";
import { Col, Container, Row } from "reactstrap";
import TableComponent from "../Common/Component/TableComponent";
import { FaPencilAlt, FaPencilRuler, FaTrashAlt } from "react-icons/fa";
import { fetchDataGet } from "../../api/Services";
import { HEALTH_PACKAGES_API } from "../../api";
import PaginationComponent from "../Common/Component/PaginationComponent";
import TableSkeleton from "../Common/Component/TableSkeleton";
const ITEMS_PER_PAGE = 7;

const HealthPackages = () => {
  const [showHealthPackageForm, setShowHealthPackageForm] = useState(false);
  const [healthPackageData, setHealthPackageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.ceil(healthPackageData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = healthPackageData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // const handleDeleteDepartment = async (id) => {
  //     Swal.fire({
  //       title: "Are you sure?",
  //       text: "Do you want to delete this departnet?",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonColor: "#fc4438",
  //       cancelButtonColor: "#6c757d",
  //       confirmButtonText: "Yes, delete it!",
  //     }).then(async (result) => {
  //       if (result.isConfirmed) {
  //         try {
  //           const response = await dispatch(deleteDepartment(id)); //await deleteSpeciality(id);
  //           if (response) {
  //             toasterConfig(
  //               "success",
  //               response.data?.message || "Deleted successfully"
  //             );
  //             dispatch(fetchDepartments()); // fetchSpecialities(); // Refresh the list
  //           } else {
  //             toasterConfig("error", "Something went wrong");
  //           }
  //         } catch (error) {
  //           toasterConfig("error", "Something went wrong");
  //         }
  //       }
  //     });
  //   };

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
              {loading ? (
                <TableSkeleton />
              ) : (
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
                      {currentData.map((data, index) => (
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
              )}
              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
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
