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
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 7;
const Specialities = () => {
  const [showSpecialityForm, setSpecialityForm] = useState(false);
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingSpeciality, setEditingSpeciality] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

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
      isNavigationDisplay: speciality.isNavigationDisplay !== undefined ? speciality.isNavigationDisplay : false,
      icon: Array.isArray(speciality.icon) ? speciality.icon[0] || "" : (speciality.icon || ""),
      banner: Array.isArray(speciality.banner) ? speciality.banner[0] || "" : (speciality.banner || ""),
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
                <TableComponent
                  headers={["Icon", "Name", "Doctor", "Description", "Action"]}
                  tableBody={
                    <tbody>
                      {currentData?.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No Specialities found
                          </td>
                        </tr>
                      ) : (
                        currentData?.map((item, index) => (
                          <tr key={index}>
                            <td>
                              {(() => {
                                const iconUrl = Array.isArray(item.icon) ? item.icon[0] : item.icon;
                                return iconUrl ? (
                                  <img 
                                    style={{width: "50px", height: "50px", objectFit: "cover"}} 
                                    src={iconUrl} 
                                    alt={item.specialityName}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'block';
                                    }}
                                  />
                                ) : null;
                              })()}
                              <div style={{display: 'none', width: '50px', height: '50px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px'}}>
                                No Icon
                              </div>
                            </td>
                            <td>{item.specialityName || "N/A"}</td>
                            <td>{item.doctorName || item.doctor || item.doctorID || "N/A"}</td>
                            <td
                              width="30%"
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "150px",
                              }}
                            >
                              {item.shortDescription || item.pageDescription || "N/A"}
                            </td>
                            <td width={"10%"}>
                              <FaPencilAlt
                                color="#7366ff"
                                onClick={() => handleEditSpeciality(item)}
                                className="me-2 text-primary cursor-pointer"
                                title="Edit Speciality"
                              />
                              &nbsp;&nbsp;<span className="text-muted">|</span>
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
                <PaginationComponent
                  currentPage={currentPage}
                  totalPages={totalPages}
                  handlePageChange={handlePageChange}
                />
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
