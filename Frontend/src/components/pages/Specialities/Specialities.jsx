import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, Button, Card, Row, Col, Table } from "react-bootstrap";
import PageHeader from "../../common/PageHeader";
import SpecialitiesForm from "./SpecialitiesForm";
import ContainerCard from "../../common/ContainerCard";
import { FaEdit, FaTrash } from "react-icons/fa";
import { BiEdit, BiEditAlt } from "react-icons/bi";
import EditButton from "../../common/EditButton";
import DeleteButton from "../../common/DeleteButton";

const mockDoctors = [
  { id: 1, name: "Dr. John Doe" },
  { id: 2, name: "Dr. Jane Smith" },
  { id: 3, name: "Dr. Emily Johnson" },
];

const Specialities = () => {
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (data) => {
    console.log(data);
    setShowForm(false);
  };

  return (
    <ContainerCard className="container_card">
      <>
        <PageHeader
          title={showForm ? "Add Speciality" : "Specialities"}
          buttonText={showForm ? "" : "Add Speciality"}
          onButtonClick={() => setShowForm(!showForm)}
        />

        {!showForm && (
          <Table bordered hover responsive className="px-2">
            <thead>
              <tr className="table-primary">
                <th>Speciality Name</th>
                <th>Icon</th>
                <th>Display Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Speciality 1</td>
                <td>Icon 1</td>
                <td>1</td>
                <td>
                  <EditButton />&nbsp;&nbsp;
                  <DeleteButton />
                </td>
              </tr>
            </tbody>
          </Table>
        )}
      </>
      {showForm && (
        <SpecialitiesForm
          show={showForm}
          handleClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      )}
    </ContainerCard>
  );
};

export default Specialities;
