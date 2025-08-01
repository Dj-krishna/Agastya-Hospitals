import React, { Fragment, useState } from "react";
import { Breadcrumbs, Btn } from "../../AbstractElements";
import { Card, Container, Form, Row } from "reactstrap";
import UserRolesForm from "./UserRolesForm";
import TableComponent from "../Common/Component/TableComponent";
import { USER_ROLES_API } from "../../api";
import { fetchDataGet } from "../../api/Services";
import Swal from "sweetalert2"; // Add this import
import { FaEdit, FaInfoCircle, FaPencilAlt, FaUserEdit } from "react-icons/fa"; // Add this import
import ModulesModal from "./ModulesModal";

const RolesPermissions = () => {
  const [showUserRoleForm, setShowUserRoleForm] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const [openModules, setOpenModules] = useState(false);
  const [moduleData, setModuleData] = useState([]);

  const fetchUserRoles = async () => {
    try {
      const response = await fetchDataGet(USER_ROLES_API);
      setUserRoles(response);
      console.log("User Roles:", response);
    } catch (error) {
      console.error("Error fetching user roles:", error);
    }
  };

  // Fetch user roles when the component mounts
  React.useEffect(() => {
    fetchUserRoles();
  }, []);

  // Function to show modules in SweetAlert
  const showModules = (modules) => {
    setModuleData(modules);
    setOpenModules(true);
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
                title={"User Role Details"}
                headers={["Role Name", "Role ID", "Action"]}
                tableBody={
                  <tbody>
                    {userRoles?.map((role, index) => (
                      <tr key={index}>
                        <td>{role.roleName}</td>
                        <td>{role.roleID}</td>
                        {/* <td>
                          <Btn
                            attrBtn={{
                              color: "info",
                              onClick: () => showModules(role.defaultModules),
                              outline: true,
                            }}
                          >
                            View Modules
                          </Btn>
                        </td> */}
                        <td>
                          <FaPencilAlt />
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
        <UserRolesForm onClose={() => setShowUserRoleForm(false)} />
      )}
      {/* <ModulesModal
        openModules={openModules}
        toggler={() => setOpenModules(!openModules)}
        children={moduleData.map((module, index) => (
          <Card className="shadow-lg b-primary rounded-none" key={index}>
            {module}
          </Card>
        ))}
      /> */}
    </Fragment>
  );
};

export default RolesPermissions;
