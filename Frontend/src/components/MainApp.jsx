import { Container, Row, Col, Nav, Badge } from 'react-bootstrap';
import { FaHome, FaThLarge, FaFolderOpen, FaFileAlt, FaShoppingCart, FaEnvelope, FaComments, FaUsers, FaRegBookmark, FaPhone, FaTasks, FaCalendarAlt, FaShareAlt, FaRegCheckCircle, FaSearch } from 'react-icons/fa'
import { BsGrid } from 'react-icons/bs';
import { Outlet, Link } from 'react-router-dom';

function MainApp() {
    return (
        <Container fluid>
            <Row>
                <Col xs={2} className="sidebar bg-white min-vh-100 p-0 border-end">
                    <div className="sidebar-header d-flex align-items-center p-3 border-bottom">
                        {/* <img src="https://img.icons8.com/color/48/000000/c.png" alt="Logo" style={{ width: 36, height: 36, marginRight: 8 }} /> */}
                        <span className="fs-4 fw-bold">Agastya Hospitals</span>
                        <BsGrid className="ms-auto fs-4" />
                    </div>
                    <div className="sidebar-section px-3 mt-4">
                        <Nav className="flex-column">
                            <Nav.Link as={Link} to="/dashboard" className="d-flex align-items-center sidebar-link">
                                <FaHome className="me-2" />
                                Dashboard
                                <Badge bg="light" text="primary" className="ms-auto">5</Badge>
                            </Nav.Link>
                            <Nav.Link as={Link} to="/doctors" className="d-flex align-items-center sidebar-link">
                                <FaThLarge className="me-2" />
                                Doctors
                            </Nav.Link>
                        </Nav>

                        <Nav className="flex-column">
                            <Nav.Link as={Link} to="/specialities" className="d-flex align-items-center sidebar-link">
                                <FaFolderOpen className="me-2" />
                                Specialities
                                <Badge bg="danger" className="ms-auto">New</Badge>
                            </Nav.Link>
                            <Nav.Link as={Link} to="/departments" className="d-flex align-items-center sidebar-link">
                                <FaFileAlt className="me-2" />
                                Departments
                            </Nav.Link>
                            <Nav.Link as={Link} to="/technologies" className="d-flex align-items-center sidebar-link">
                                <FaShoppingCart className="me-2" />
                                Technologies
                            </Nav.Link>
                            <Nav.Link as={Link} to="/appointments" className="d-flex align-items-center sidebar-link">
                                <FaEnvelope className="me-2" />
                                Appointments
                            </Nav.Link>
                            <Nav.Link as={Link} to="/patients" className="d-flex align-items-center sidebar-link">
                                <FaComments className="me-2" />
                                Patients
                            </Nav.Link>
                            <Nav.Link as={Link} to="/health-packages" className="d-flex align-items-center sidebar-link">
                                <FaUsers className="me-2" />
                                Health Packages
                            </Nav.Link>
                            <Nav.Link as={Link} to="/enquiries" className="d-flex align-items-center sidebar-link">
                                <FaRegBookmark className="me-2" />
                                Enquiries
                            </Nav.Link>
                            <Nav.Link as={Link} to="/blog" className="d-flex align-items-center sidebar-link">
                                <FaPhone className="me-2" />
                                Blog
                            </Nav.Link>
                            <Nav.Link as={Link} to="/cms" className="d-flex align-items-center sidebar-link">
                                <FaTasks className="me-2" />
                                CMS
                            </Nav.Link>
                            <Nav.Link as={Link} to="/roles-permissions" className="d-flex align-items-center sidebar-link">
                                <FaCalendarAlt className="me-2" />
                                Roles & Permissions
                            </Nav.Link>
                            <Nav.Link as={Link} to="/settings" className="d-flex align-items-center sidebar-link">
                                <FaShareAlt className="me-2" />
                                Settings
                            </Nav.Link>
                            <Nav.Link as={Link} to="/logout" className="d-flex align-items-center sidebar-link">
                                <FaRegCheckCircle className="me-2" />
                                Logout
                            </Nav.Link>
                        </Nav>
                    </div>
                </Col>
                <Col xs={10} className="main-content">
                    <Outlet />
                </Col>
            </Row>
        </Container>
    )
}

export default MainApp;