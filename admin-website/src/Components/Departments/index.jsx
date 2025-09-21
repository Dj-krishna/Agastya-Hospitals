import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteDepartment,
  fetchDepartments,
} from "../../slices/departmentSlice";
import { Breadcrumbs } from "../../AbstractElements";
import DepartmentForm from "./DepartmentForm";
import { Col, Container, Row } from "reactstrap";
import TableComponent from "../Common/Component/TableComponent";
import TableSkeleton from "../Common/Component/TableSkeleton";
import { format } from "date-fns";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { toasterConfig } from "../../utils";
import Swal from "sweetalert2";

const Departments = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [deptData, setDeptData] = useState(null);
  const [showDeptForm, setShowDeptForm] = useState(false);
  const [searchText, setSearchText] = useState("");

  const dispatch = useDispatch();
  const {
    data: departments,
    loading,
    error,
  } = useSelector((state) => {
    return state.departments;
  });

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const filteredDepartments = departments?.filter((data) =>
    data.departmentName?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDeleteDepartment = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this departnet?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#fc4438",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await dispatch(deleteDepartment(id)); //await deleteSpeciality(id);
          if (response) {
            toasterConfig(
              "success",
              response.data?.message || "Deleted successfully"
            );
            dispatch(fetchDepartments()); // fetchSpecialities(); // Refresh the list
          } else {
            toasterConfig("error", "Something went wrong");
          }
        } catch (error) {
          toasterConfig("error", "Something went wrong");
        }
      }
    });
  };

  const handleEdit = (data) => {
    setDeptData(data);
    setIsEditMode(true);
    setShowDeptForm(true);
  };

  return (
    <>
      <Breadcrumbs
        mainTitle="Departments"
        parent="Home"
        title="Departments"
        buttonTitle={"Add Department"}
        btnColor={"primary"}
        onClick={() => {
          setShowDeptForm(true);
          setIsEditMode(false);
          setDeptData(null);
        }}
      />
      <Container fluid={true}>
        <Row className="widget-grid">
          <Col sm="12" md="12" lg="12" xl="12">
            {loading ? (
              <TableSkeleton rows={6} columns={3} />
            ) : (
              <TableComponent
                headers={[
                  "Department Name",
                  "Created Date",
                  "Updated Date",
                  "Actions",
                ]}
                isSearch={true}
                searchText={searchText}
                onSearch={(e) => setSearchText(e.target.value)}
                tableBody={
                  <tbody>
                    {filteredDepartments.map((data) => (
                      <tr key={data._id}>
                        <td>{data.departmentName}</td>
                        <td>
                          {format(new Date(data.createdAt), "dd/MM/yyyy")}
                        </td>
                        <td>
                          {format(new Date(data.updatedAt), "dd/MM/yyyy")}
                        </td>
                        <td>
                          <FaPencilAlt
                            color="#7366ff"
                            onClick={() => handleEdit(data)}
                            className="me-2 text-primary cursor-pointer"
                            title="Edit Speciality"
                          />
                          &nbsp;&nbsp;<span className="text-muted">|</span>
                          &nbsp;&nbsp;
                          <FaTrashAlt
                            onClick={() =>
                              handleDeleteDepartment(data.departmentID)
                            }
                            className="text-danger cursor-pointer"
                            title="Delete Speciality"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                }
              />
            )}
          </Col>
        </Row>
      </Container>

      <DepartmentForm
        isEditMode={isEditMode}
        initialData={deptData}
        setShowDeptForm={setShowDeptForm}
        isOpen={showDeptForm}
        onClose={() => setShowDeptForm(false)}
      />
    </>
  );
};

export default Departments;
