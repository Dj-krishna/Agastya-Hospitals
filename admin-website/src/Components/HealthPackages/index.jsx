import React, { Fragment, useEffect, useState } from "react";
import HealthPackagesForm from "./HealthPackagesForm";
import { Breadcrumbs } from "../../AbstractElements";
import { Container, Row } from "reactstrap";
import TableComponent from "../Common/Component/TableComponent";
import { FaPencilAlt,  FaTrashAlt } from "react-icons/fa";
import { fetchDataGet } from "../../api/Services";
import { HEALTH_PACKAGES_API } from "../../api";
import TableSkeleton from "../Common/Component/TableSkeleton";
import { deleteHealthPackage } from "../../api/Services";
import Swal from "sweetalert2";
import { toasterConfig } from "../../utils";

const HealthPackages = () => {
  const [showHealthPackageForm, setShowHealthPackageForm] = useState(false);
  const [healthPackageData, setHealthPackageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

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


  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this Health Package?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#fc4438",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteHealthPackage(id); 
          if (response) {
            toasterConfig(
              "success",
              response.data?.message || "Deleted successfully"
            );
            fetchHealthPackages();
          } else {
            toasterConfig("error", "Something went wrong");
          }
        } catch (error) {
          toasterConfig("error", "Something went wrong");
        }
      }
    });
  };

  const filteredPackages = healthPackageData.filter((data) =>
    data.packageName.toLowerCase().includes(searchText.toLowerCase())
  );

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
                  isSearch={true}
                  searchText={searchText}
                  onSearch={(e) => setSearchText(e.target.value)}
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
                      {filteredPackages.length > 0 ? (
                        filteredPackages.map((data, index) => (
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
                              <FaTrashAlt color="#fc4438" onClick={()=>handleDelete(data.packageID)}/>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center">No data found...</td>
                        </tr>
                      )}
                    </tbody>
                  }
                />
              )}
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
