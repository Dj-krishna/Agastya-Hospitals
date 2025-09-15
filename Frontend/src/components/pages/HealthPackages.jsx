import React from "react";
import PageHeader from "../common/PageHeader";
import ContainerCard from "../common/ContainerCard";
import { Table, Badge, Button, Row, Col } from "react-bootstrap";
import { BiEditAlt, BiTrash } from "react-icons/bi";
import EditButton from "../common/EditButton";
import DeleteButton from "../common/DeleteButton";

const mockPackages = [
  {
    name: "Basic Health Checkup",
    type: "General",
    price: "₹999",
    duration: "1 Day",
    description: "Basic blood, urine, and physical tests.",
    status: "Active",
  },
  {
    name: "Executive Health Checkup",
    type: "Executive",
    price: "₹2999",
    duration: "1 Day",
    description: "Comprehensive tests for working professionals.",
    status: "Active",
  },
  {
    name: "Diabetes Profile",
    type: "Specialized",
    price: "₹1499",
    duration: "1 Day",
    description: "Tests and consultation for diabetes management.",
    status: "Active",
  },
  {
    name: "Cardiac Health Package",
    type: "Cardiology",
    price: "₹2499",
    duration: "1 Day",
    description: "ECG, Echo, TMT, and cardiac consultation.",
    status: "Active",
  },
  {
    name: "Women Wellness Package",
    type: "Women",
    price: "₹1999",
    duration: "1 Day",
    description: "Health checkup for women including Pap smear.",
    status: "Active",
  },
  {
    name: "Senior Citizen Package",
    type: "Senior",
    price: "₹1799",
    duration: "1 Day",
    description: "Tests for elderly including bone density.",
    status: "Active",
  },
  {
    name: "Pre-Employment Checkup",
    type: "Corporate",
    price: "₹1299",
    duration: "1 Day",
    description: "Tests required for employment onboarding.",
    status: "Inactive",
  },
  {
    name: "Child Health Package",
    type: "Pediatric",
    price: "₹899",
    duration: "1 Day",
    description: "Basic tests for children including growth assessment.",
    status: "Active",
  },
  {
    name: "Cancer Screening Package",
    type: "Oncology",
    price: "₹3499",
    duration: "1 Day",
    description: "Screening for common cancers (male/female).",
    status: "Active",
  },
  {
    name: "Maternity Package",
    type: "Maternity",
    price: "₹24999",
    duration: "3 Days",
    description: "Antenatal, delivery, and postnatal care.",
    status: "Active",
  },
];

const HealthPackages = () => {
  return (
    <ContainerCard>
      <PageHeader title="Health Packages" buttonText="Add Health Package" />
      <Row>
        <Col xs={12} md={12} lg={12}>
          <div className="table-responsive-scroll">
            <Table striped hover responsive className="px-2" bordered>
              <thead>
                <tr className="table-primary">
                  <th>Name</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Duration (Days)</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {mockPackages.map((pkg, idx) => (
                  <tr key={pkg.name}>
                    <td>{pkg.name}</td>
                    <td>{pkg.type}</td>
                    <td>{pkg.price}</td>
                    <td>{pkg.duration}</td>
                    <td>{pkg.description}</td>
                    <td>
                      <Badge
                        bg={pkg.status === "Active" ? "success" : "secondary"}
                      >
                        {pkg.status}
                      </Badge>
                    </td>
                    <td>
                      <EditButton />
                      &nbsp;&nbsp;
                      <DeleteButton />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </ContainerCard>
  );
};

export default HealthPackages;
