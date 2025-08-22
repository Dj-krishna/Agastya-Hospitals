import React, { Fragment, useEffect, useState } from "react";
import { Container, Row } from "reactstrap";
import { Breadcrumbs } from "../../../AbstractElements";
import WidgetsWrapper from "./WidgetsWraper";
import axios from "axios";
import { APPOINTMENTS_API } from "../../../api";
import AppointmentsTable from "../../Appointments/AppointmentsTable";
import { appointmentsCount } from "../../../api/Services";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [cancelledAppointments, setCancelledAppointments] = useState(0);
  const today = new Date();

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
    appointmentsCount(today).then((data) => {
      setTotalAppointments(data.totalAppointments);
      setCancelledAppointments(data.cancelledAppointments);
    }).catch((error) => {
      console.error("Error fetching appointment counts:", error);
    });
  }, []);

  return (
    <Fragment>
      <Breadcrumbs mainTitle="Dashboard" />
      <Container fluid={true}>
        <Row className="widget-grid">
          <WidgetsWrapper
            totalAppointments={totalAppointments}
            cancelledAppointments={cancelledAppointments}
          />
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
