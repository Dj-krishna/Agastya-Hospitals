import { Row, Col, Nav, Container } from "react-bootstrap";
import {
  FaHome,
  FaThLarge,
  FaFolderOpen,
  FaFileAlt,
  FaShoppingCart,
  FaEnvelope,
  FaComments,
  FaUsers,
  FaRegBookmark,
  FaPhone,
  FaTasks,
  FaCalendarAlt,
  FaShareAlt,
  FaRegCheckCircle,
  FaBell,
} from "react-icons/fa";
import { BsGrid } from "react-icons/bs";
import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
import SearchInput from "./common/SearchInput";
import { useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";

function MainApp() {
  const [tabActive, setTabActive] = useState("Dashboard");
  const [searchInput, setSearchInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dispatch = useDispatch();
  const handleTabClick = (tab) => {
    setTabActive(tab);
  };
  
  return (
    <Container fluid className="d-flex">
      <div className={`sidebar bg-white min-vh-100 p-0 border-end${sidebarOpen ? "" : " collapsed"}`}>
        <div className="sidebar-header d-flex align-items-center p-3 border-bottom">
          <span
            className={`fs-5 fw-bold sidebar-title ${sidebarOpen ? "show" : ""}`}
            style={{
              transition: "opacity 0.3s cubic-bezier(0.4,0,0.2,1), max-width 0.3s cubic-bezier(0.4,0,0.2,1)",
              opacity: sidebarOpen ? 1 : 0,
              maxWidth: sidebarOpen ? "200px" : "0px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              display: "inline-block"
            }}
          >
            Agastya Hospitals
          </span>
          <BsGrid
            className="ms-auto fs-4"
            style={{ cursor: "pointer" }}
            onClick={() => setSidebarOpen((open) => !open)}
          />
        </div>
        <div className="sidebar-section px-3 mt-2 sidebar-scroll">
          <Nav className="flex-column">
            <Nav.Link
              as={Link}
              to="/dashboard"
              className={`d-flex align-items-center sidebar-link ${
                tabActive === "Dashboard" ? "active" : ""
              }`}
              onClick={() => handleTabClick("Dashboard")}
            >
              <FaHome className="me-2" />
              {sidebarOpen && "Dashboard"}
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/doctors"
              className={`d-flex align-items-center sidebar-link ${
                tabActive === "Doctors" ? "active" : ""
              }`}
              onClick={() => handleTabClick("Doctors")}
            >
              <FaThLarge className="me-2" />
              {sidebarOpen && "Doctors"}
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/specialities"
              className={`d-flex align-items-center sidebar-link ${
                tabActive === "Specialities" ? "active" : ""
              }`}
              onClick={() => handleTabClick("Specialities")}
            >
              <FaFolderOpen className="me-2" />
              {sidebarOpen && "Specialities"}
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/departments"
              className={`d-flex align-items-center sidebar-link ${
                tabActive === "Departments" ? "active" : ""
              }`}
              onClick={() => handleTabClick("Departments")}
            >
              <FaFileAlt className="me-2" />
              {sidebarOpen && "Departments"}
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/technologies"
              className={`d-flex align-items-center sidebar-link ${
                tabActive === "Technologies" ? "active" : ""
              }`}
              onClick={() => handleTabClick("Technologies")}
            >
              <FaShoppingCart className="me-2" />
              {sidebarOpen && "Technologies"}
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/appointments"
              className={`d-flex align-items-center sidebar-link ${
                tabActive === "Appointments" ? "active" : ""
              }`}
              onClick={() => handleTabClick("Appointments")}
            >
              <FaEnvelope className="me-2" />
              {sidebarOpen && "Appointments"}
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/patients"
              className={`d-flex align-items-center sidebar-link ${
                tabActive === "Patients" ? "active" : ""
              }`}
              onClick={() => handleTabClick("Patients")}
            >
              <FaComments className="me-2" />
              {sidebarOpen && "Patients"}
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/health-packages"
              className={`d-flex align-items-center sidebar-link ${
                tabActive === "Health Packages" ? "active" : ""
              }`}
              onClick={() => handleTabClick("Health Packages")}
            >
              <FaUsers className="me-2" />
              {sidebarOpen && "Health Packages"}
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/enquiries"
              className={`d-flex align-items-center sidebar-link ${
                tabActive === "Enquiries" ? "active" : ""
              }`}
              onClick={() => handleTabClick("Enquiries")}
            >
              <FaRegBookmark className="me-2" />
              {sidebarOpen && "Enquiries"}
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/blog"
              className={`d-flex align-items-center sidebar-link ${
                tabActive === "Blog" ? "active" : ""
              }`}
              onClick={() => handleTabClick("Blog")}
            >
              <FaPhone className="me-2" />
              {sidebarOpen && "Blog"}
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/cms"
              className={`d-flex align-items-center sidebar-link ${
                tabActive === "CMS" ? "active" : ""
              }`}
              onClick={() => handleTabClick("CMS")}
            >
              <FaTasks className="me-2" />
              {sidebarOpen && "CMS"}
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/roles-permissions"
              className={`d-flex align-items-center sidebar-link ${
                tabActive === "Roles & Permissions" ? "active" : ""
              }`}
              onClick={() => handleTabClick("Roles & Permissions")}
            >
              <FaCalendarAlt className="me-2" />
              {sidebarOpen && "Roles"}
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/settings"
              className={`d-flex align-items-center sidebar-link ${
                tabActive === "Settings" ? "active" : ""
              }`}
              onClick={() => handleTabClick("Settings")}
            >
              <FaShareAlt className="me-2" />
              {sidebarOpen && "Settings"}
            </Nav.Link>
            {/* Logout menu option: call onLogout on click */}
            <Nav.Link
              className={`d-flex align-items-center sidebar-link ${
                tabActive === "Logout" ? "active" : ""
              }`}
              onClick={() => {
                handleTabClick("Logout");
                dispatch(logout());
              }}
              style={{ cursor: "pointer" }}
            >
              <FaRegCheckCircle className="me-2" />
              {sidebarOpen && "Logout"}
            </Nav.Link>
          </Nav>
        </div>
      </div>
      <div className={`main-content-container ${sidebarOpen ? "collapsed" : "expanded"}`}>
        <SearchInput
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        />
        <Outlet />
      </div>
    </Container>
  );
}

export default MainApp;
