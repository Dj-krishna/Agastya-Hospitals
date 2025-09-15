import React from "react";
import PageHeader from "../common/PageHeader";
import ContainerCard from "../common/ContainerCard";
import { Table, Button, Dropdown } from "react-bootstrap";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiEditAlt } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import EditButton from "../common/EditButton";
import DeleteButton from "../common/DeleteButton";

const mockPatients = [
  {
    id: 1,
    name: "Abu Isthiyak",
    initial: "A",
    initialColor: "#d1f5ec",
    department: "Gastroenterology",
    doctor: {
      name: "Joe Larson",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    serial: "05",
    date: "18/12/2020",
    status: { label: "Waiting", color: "#00bcd4" },
  },
  {
    id: 2,
    name: "Amelia Grant",
    initial: "A",
    initialColor: "#fff2e1",
    department: "Medicine",
    doctor: {
      name: "Patrick Newman",
      avatar: "https://randomuser.me/api/portraits/men/33.jpg",
    },
    serial: "10",
    date: "12/02/2021",
    status: { label: "Visited", color: "#6c757d" },
  },
  {
    id: 3,
    name: "Kristen Hawkins",
    initial: "K",
    initialColor: "#f3f0ff",
    department: "Orthopaedics",
    doctor: {
      name: "Emma Walker",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    serial: "02",
    date: "12/03/2021",
    status: { label: "Visited", color: "#6c757d" },
  },
  {
    id: 4,
    name: "Tommy Vasquez",
    initial: "T",
    initialColor: "#f3f0ff",
    department: "Cardiology",
    doctor: {
      name: "Jane Montgomery",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    serial: "15",
    date: "12/04/2021",
    status: { label: "Canceled", color: "#f44336" },
  },
  {
    id: 5,
    name: "Alejandro Haynes",
    initial: "A",
    initialColor: "#d1f5ec",
    department: "Orthopaedics",
    doctor: {
      name: "Emma Walker",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    serial: "11",
    date: "12/05/2021",
    status: { label: "Waiting", color: "#00bcd4" },
  },
];

const Patients = () => {
  return (
    <ContainerCard>
      <PageHeader title="Patients" buttonText="Add Patient" />
      <Table hover responsive striped bordered className="px-2">
        <thead>
          <tr className='table-primary'>
            <th>Patient</th>
            <th>Department</th>
            <th>Doctor</th>
            <th>Serial No</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {mockPatients.map((p) => (
            <tr key={p.id}>
              <td>
                <span className="patients-name">{p.name}</span>
              </td>
              <td>{p.department}</td>
              <td>
                <img
                  src={p.doctor.avatar}
                  alt={p.doctor.name}
                  className="patients-doctor-avatar"
                  width={"30px"}
                />
                <span className="patients-doctor-name p-2">
                  {p.doctor.name}
                </span>
              </td>
              <td>{p.serial}</td>
              <td>{p.date}</td>
              <td>
                <span
                  className="patients-status"
                  style={{ color: p.status.color }}
                >
                  {p.status.label}
                </span>
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
    </ContainerCard>
  );
};

export default Patients;
