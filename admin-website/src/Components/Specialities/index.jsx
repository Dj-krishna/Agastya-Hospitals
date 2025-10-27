import React, { Fragment, useEffect, useState } from "react";
import { Breadcrumbs, Btn } from "../../AbstractElements";
import { Button, Col, Container, Row } from "reactstrap";
import SpecialityForm from "./SpecialityForm";
import TableComponent from "../Common/Component/TableComponent";
import { FaEdit, FaPencilAlt, FaTrash, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { deleteSpeciality } from "../../api/Services";
import { SPECIALITIES_API } from "../../api";
import { fetchDataGet } from "../../api/Services";
import TableSkeleton from "../Common/Component/TableSkeleton";
import { toast } from "react-toastify";
import { toasterConfig } from "../../utils";
import axios from "axios";
import { useDispatch } from "react-redux";

const ITEMS_PER_PAGE = 7;
const Specialities = () => {
  const [showSpecialityForm, setSpecialityForm] = useState(false);
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [editingSpeciality, setEditingSpeciality] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const dispatch = useDispatch();

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

  const handleEditSpeciality = (speciality) => {
    // Map the data to match the form structure
    const mappedSpeciality = {
      ...speciality,
      // Handle both doctor and doctorID fields for backward compatibility
      doctor: speciality.doctor || speciality.doctorID,
      doctorID: speciality.doctor || speciality.doctorID,
      // Ensure all required fields are present
      specialityName: speciality.specialityName || "",
      urlSlug: speciality.urlSlug || "",
      shortDescription: speciality.shortDescription || "",
      pageDescription: speciality.pageDescription || "",
      isActive: speciality.isActive !== undefined ? speciality.isActive : true,
      isNavigationDisplay:
        speciality.isNavigationDisplay !== undefined
          ? speciality.isNavigationDisplay
          : false,
      icon: Array.isArray(speciality.icon)
        ? speciality.icon[0] || ""
        : speciality.icon || "",
      banner: Array.isArray(speciality.banner)
        ? speciality.banner[0] || ""
        : speciality.banner || "",
      seoMetaData: speciality.seoMetaData || "",
      displayOrder: speciality.displayOrder || "",
    };
    setEditingSpeciality(mappedSpeciality);
    setIsEditMode(true);
    setSpecialityForm(true);
  };

  const handleCloseForm = () => {
    setSpecialityForm(false);
    setEditingSpeciality(null);
    setIsEditMode(false);
    // Refresh the list after form closes
    fetchSpecialities();
  };

  const handleDeleteSpeciality = async (speciality) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `You want to delete "${speciality.specialityName}"? This action cannot be undone.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        await deleteSpeciality(speciality.specialityID);
        toast.success("Speciality deleted successfully!");
        fetchSpecialities(); // Refresh the list
      }
    } catch (error) {
      console.error("Error deleting speciality:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to delete speciality. Please try again.";
      toast.error(errorMessage);
    }
  };

  const filteredSpecialities = specialities?.length
    ? specialities.filter((spec) =>
        spec.specialityName.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  return (
    <Fragment>
      {!showSpecialityForm ? (
        <>
          <Breadcrumbs
            mainTitle="Specialities"
            buttonTitle={"Add Speciality"}
            onClick={() => {
              setEditingSpeciality(null);
              setIsEditMode(false);
              setSpecialityForm(true);
            }}
          />

          <Container fluid={true}>
            {loading ? (
              <TableSkeleton columns={4} rows={10} />
            ) : (
              <Row className="">
                <Col md={12} sm={12} xs={12} lg={12}>
                  <TableComponent
                    isSearch={true}
                    searchText={searchText}
                    onSearch={(e) => setSearchText(e.target.value)}
                    headers={[
                      "Icon",
                      "Name",
                      "Doctor",
                      "Description",
                      "Action",
                    ]}
                    tableBody={
                      <tbody>
                        {filteredSpecialities?.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="text-center">
                              No Specialities found
                            </td>
                          </tr>
                        ) : (
                          filteredSpecialities?.map((item, index) => (
                            <tr key={index}>
                              <td>
                                {item.icon ? (
                                  <img
                                    style={{
                                      width: "30px",
                                      height: "30px",
                                      objectFit: "cover",
                                    }}
                                    src={
                                      Array.isArray(item.icon)
                                        ? item.icon[0]
                                        : item.icon
                                    }
                                    alt={item.specialityName}
                                  />
                                ) : (
                                  "No Icon"
                                )}
                              </td>
                              <td>{item.specialityName || "N/A"}</td>
                              <td>
                                {(() => {
                                  // Prefer doctorNames array from API and filter out null/empty entries
                                  if (Array.isArray(item.doctorNames)) {
                                    const names = item.doctorNames
                                      .filter((n) => n && String(n).trim() !== "")
                                      .join(", ");
                                    if (names) return names;
                                  }

                                  // Fallbacks: doctor (array of IDs) or single doctor/doctorID
                                  if (Array.isArray(item.doctor) && item.doctor.length > 0) {
                                    return item.doctor.join(", ");
                                  }
                                  return item.doctor  || "N/A";
                                })()}
                              </td>
                              <td
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: "150px",
                                }}
                                title={
                                  item.shortDescription || item.pageDescription
                                }
                              >
                                {item.shortDescription ||
                                  item.pageDescription ||
                                  "N/A"}
                              </td>
                              <td>
                                <FaPencilAlt
                                  color="#7366ff"
                                  onClick={() => handleEditSpeciality(item)}
                                  className="me-2 text-primary cursor-pointer"
                                  title="Edit Speciality"
                                />
                                &nbsp;&nbsp;
                                <span className="text-muted">|</span>
                                &nbsp;&nbsp;
                                <FaTrashAlt
                                  onClick={() => handleDeleteSpeciality(item)}
                                  className="text-danger cursor-pointer"
                                  title="Delete Speciality"
                                />
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    }
                  />
                </Col>
              </Row>
            )}
          </Container>
        </>
      ) : (
        <SpecialityForm
          onClose={handleCloseForm}
          initialData={editingSpeciality}
          isEditMode={isEditMode}
        />
      )}
    </Fragment>
  );
};

export default Specialities;
