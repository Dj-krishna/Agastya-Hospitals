import React, { Fragment, useEffect, useState } from "react";
import { Container, Row } from "reactstrap";
import { Breadcrumbs } from "../../../AbstractElements";
import WidgetsWrapper from "./WidgetsWraper";
import axios from "axios";
import { APPOINTMENTS_API } from "../../../api";
import AppointmentsTable from "../../Appointments/AppointmentsTable";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const today = new Date(26/10/2025);

  const fetchAppointments = async () => {
    const dateParam = `?date=${today}`;
    try {
      const response = await axios.get(APPOINTMENTS_API + dateParam);
      setAppointments(response.data.appointments);
      console.log(response.data.appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <Fragment>
      <Breadcrumbs mainTitle="Dashboard" />
      <Container fluid={true}>
        <Row className="widget-grid">
          <WidgetsWrapper />
          <AppointmentsTable
            appointments={appointments}
            flowType={"dashBoard"}
          />
        </Row>
      </Container>
    </Fragment>
  );
};

export default Dashboard;
