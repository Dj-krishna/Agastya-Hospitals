import React, { Fragment, useState } from "react";
import { Breadcrumbs, Btn } from "../../AbstractElements";
import { Card, Container, Form, Row } from "reactstrap";
import UserRolesForm from "./UserRolesForm";
import TableComponent from "../Common/Component/TableComponent";
import { USERS_API } from "../../api";
import { fetchDataGet } from "../../api/Services";
import Swal from "sweetalert2"; // Add this import
import { FaEdit, FaInfoCircle, FaPencilAlt, FaUserEdit } from "react-icons/fa"; // Add this import
import ModulesModal from "./ModulesModal";

const RolesPermissions = () => {
  const [showUserRoleForm, setShowUserRoleForm] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const [editingUserRole, setEditingUserRole] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUserRoles = async () => {
    try {
      setLoading(true);
      const response = await fetchDataGet(USERS_API);
      setUserRoles(response);
      console.log("User Roles:", response);
    } catch (error) {
      console.error("Error fetching user roles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user roles when the component mounts
  React.useEffect(() => {
    fetchUserRoles();
  }, []);

  const handleEdit = (userRole) => {
    setEditingUserRole(userRole);
    setIsEditMode(true);
    setShowUserRoleForm(true);
  };

  const handleCloseForm = () => {
    setShowUserRoleForm(false);
    setEditingUserRole(null);
    setIsEditMode(false);
  };

  const handleFormSuccess = () => {
    fetchUserRoles(); // Refresh the table data
    handleCloseForm();
  };

  return (
    <Fragment>
      {!showUserRoleForm ? (
        <>
          <Breadcrumbs mainTitle="User Roles and Permissions" />

          <Container fluid={true}>
            <UserRolesForm />
            <Row className="widget-grid">
              <TableComponent
                headers={["User Name", "Role Name", "Action"]}
                tableBody={
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : userRoles?.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No user roles found
                        </td>
                      </tr>
                    ) : (
                      userRoles?.map((role, index) => (
                        <tr key={index}>
                          <td>{role.userName || role.fullName || "N/A"}</td>
                          <td>{role.roleName || role.loginType || "N/A"}</td>
                          <td>
                            <FaPencilAlt
                              color="#7366ff"
                              onClick={() => handleEdit(role)}
                              className="cursor-pointer"
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                }
              />
            </Row>
          </Container>
        </>
      ) : (
        <UserRolesForm
          isEditMode={isEditMode}
          userRoleData={editingUserRole}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </Fragment>
  );
};

export default RolesPermissions;
