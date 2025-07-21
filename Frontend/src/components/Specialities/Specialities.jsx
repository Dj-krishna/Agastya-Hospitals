import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, Button, Card, Row, Col, Table } from "react-bootstrap";
import PageHeader from "../common/PageHeader";
import SpecialitiesModal from "./SpecialitiesModal";

const mockDoctors = [
  { id: 1, name: "Dr. John Doe" },
  { id: 2, name: "Dr. Jane Smith" },
  { id: 3, name: "Dr. Emily Johnson" },
];

const Specialities = () => {
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (data) => {
    console.log(data);
  };

  return (
    <>
      <PageHeader
        title="Specialities"
        buttonText="Add Speciality"
        onButtonClick={() => setShowModal(true)}
      />
      <Card>
        <Card.Body>
          <Table>
            <thead>
              <tr>
                <th>Speciality Name</th>
                <th>Icon</th>
                <th>Display Order</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Speciality 1</td>
                <td>Icon 1</td>
                <td>1</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <SpecialitiesModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default Specialities;
