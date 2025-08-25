import React, { Fragment, useEffect, useState } from "react";
import { Breadcrumbs, Btn } from "../../AbstractElements";
import { Button, Container, Row } from "reactstrap";
import SpecialityForm from "./SpecialityForm";
import TableComponent from "../Common/Component/TableComponent";
import { FaEdit, FaPencilAlt, FaTrash, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { deleteSpeciality } from "../../api/Services";
import { SPECIALITIES_API } from "../../api";
import { fetchDataGet } from "../../api/Services";
import TableSkeleton from "../Common/Component/TableSkeleton";
import PaginationComponent from "../Common/Component/PaginationComponent";

const ITEMS_PER_PAGE = 7;
const Specialities = () => {
  const [showSpecialityForm, setSpecialityForm] = useState(false);
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchSpecialities = async () => {
    try {
      setLoading(true);
      const response = await fetchDataGet(SPECIALITIES_API);
      setSpecialities(response);
      console.log("Specialities:", response);
    } catch (error) {
      console.error("Error fetching specialities:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch specialities when the component mounts
  useEffect(() => {
    fetchSpecialities();
  }, []);

  const totalPages = Math.ceil(specialities.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = specialities.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
            {loading ? (
              <TableSkeleton columns={4} rows={10} />
            ) : (
              <Row className="">
                <TableComponent
                  headers={["Icon", "Name", "Description", "Action"]}
                  tableBody={
                    <tbody>
                      {currentData?.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center">
                            No Specialities found
                          </td>
                        </tr>
                      ) : (
                        currentData?.map((item, index) => (
                          <tr key={index}>
                            <td>{item.icon || "N/A"}</td>
                            <td>{item.specialityName || "N/A"}</td>
                            <td
                              width="40%"
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "200px",
                              }}
                            >
                              {item.pageDescription}
                            </td>
                            <td width={"10%"}>
                              <FaPencilAlt
                                color="#7366ff"
                                onClick={() => setSpecialityForm(true)}
                                className="me-2 text-primary cursor-pointer"
                              />
                              &nbsp;&nbsp;<span className="text-muted">|</span>
                              &nbsp;&nbsp;
                              <FaTrashAlt
                                onClick={() => {
                                  Swal.fire({
                                    title: "Are you sure?",
                                    text: "You won't be able to revert this!",
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#3085d6",
                                    confirmButtonText: "Yes, delete it!",
                                    cancelButtonText: "Cancel",
                                    reverseButtons: true,
                                    customClass: {
                                      confirmButton: "danger",
                                    },
                                  }).then(async (result) => {
                                    if (result.isConfirmed) {
                                      try {
                                        await deleteSpeciality(1); // or whatever your record's id is
                                        Swal.fire(
                                          "Deleted!",
                                          "The record has been deleted.",
                                          "success"
                                        );
                                        // Optionally refresh your data here
                                      } catch (error) {
                                        Swal.fire(
                                          "Error!",
                                          "Failed to delete the record.",
                                          "error"
                                        );
                                      }
                                    }
                                  });
                                }}
                                className="text-danger cursor-pointer"
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  }
                />
                {currentData.length > 6 && (
                  <PaginationComponent
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                  />
                )}
              </Row>
            )}
          </Container>
        </>
      ) : (
        <SpecialityForm onClose={() => setSpecialityForm(false)} />
      )}
    </Fragment>
  );
};

export default Specialities;
