import React, { Fragment, useEffect, useState } from "react";
import { Badges, Breadcrumbs } from "../../AbstractElements";
import { Container, Row } from "reactstrap";
import TableComponent from "../Common/Component/TableComponent";
import axios from "axios";
import { APPOINTMENTS_API } from "../../api";
import { format } from "date-fns";
import AppointmentsForm from "./AppointmentsForm";
import AppointmentsTable from "./AppointmentsTable";

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
              <AppointmentsTable appointments={appointments} />
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
