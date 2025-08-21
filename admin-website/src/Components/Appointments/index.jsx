import React, { Fragment, useEffect, useState } from "react";
import { Badges, Breadcrumbs } from "../../AbstractElements";
import { Container, Row } from "reactstrap";
import TableComponent from "../Common/Component/TableComponent";
import axios from "axios";
import { APPOINTMENTS_API } from "../../api";
import { format } from "date-fns";
import AppointmentsForm from "./AppointmentsForm";

const today = new Date();

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [searchDate, setSearchDate] = useState(today);

  const handleSearch = (date) => {
    setSearchDate(date);
    fetchAppointments(date);
  };

  const fetchAppointments = async (date) => {
    const dateParam = date ? `?date=${date}` : "";
    try {
      const response = await axios.get(APPOINTMENTS_API + dateParam);
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const renderTableBody = () => {
    return (
      <tbody>
        {appointments?.map((appointment) => (
          <tr key={appointment.appointmentID}>
            <td>{appointment.appointmentID}</td>
            <td>{appointment.patientName}</td>
            <td>{appointment.doctorName}</td>
            <td>{format(new Date(appointment.date), "dd/MM/yyyy")}</td>
            <td>
              {appointment.startTime} - {appointment.endTime}
            </td>
            <td>
              <Badges
                attrBadge={{
                  className: "badge",
                  color: appointment.status === "booked" ? "success" : "danger",
                }}
              >
                {appointment.status}
              </Badges>
            </td>
            <td>
              <button className="btn btn-primary">View</button>
            </td>
          </tr>
        ))}
      </tbody>
    );
  };

  return (
    <Fragment>
      {!showAddAppointment ? (
        <>
          <Breadcrumbs
            mainTitle={"Appointments"}
            buttonTitle={"Add Appointment"}
            onClick={() => setShowAddAppointment(true)}
            searchDate={searchDate}
            setSearchDate={handleSearch}
          />

          <Container fluid={true}>
            <Row className="widget-grid">
              <TableComponent
                headers={[
                  "Appointment ID",
                  "Patient Name",
                  "Doctor Name",
                  "Date",
                  "Time",
                  "Status",
                  "Action",
                ]}
                tableBody={renderTableBody()}
              />
            </Row>
          </Container>
        </>
      ) : (
        <AppointmentsForm onClose={() => setShowAddAppointment(false)} />
      )}
    </Fragment>
  );
};

export default Appointments;
