import React, { Fragment, useEffect, useState } from "react";
import { Container, Row } from "reactstrap";
import { Breadcrumbs } from "../../../AbstractElements";
import WidgetsWrapper from "./WidgetsWraper";
import axios from "axios";
import { APPOINTMENTS_API } from "../../../api";
import AppointmentsTable from "../../Appointments/AppointmentsTable";
import { appointmentsCount } from "../../../api/Services";
import { toast } from "react-toastify";
import Loader from "../../Common/Component/Loader";
import TableSkeleton from "../../Common/Component/TableSkeleton";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [cancelledAppointments, setCancelledAppointments] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const today = new Date();

  const fetchAppointments = async () => {
    const dateParam = `?date=${today}`;
    setIsLoading(true);
    try {
      const response = await axios.get(APPOINTMENTS_API + dateParam);
      if (response.data.appointments) {
        setAppointments(response.data.appointments);
        setIsLoading(false);
      }
      console.log(response.data.appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setTimeout(() => {
        toast.error("Error fetching appointments");
        setIsLoading(true);
      }, 5000);
    }
  };

  useEffect(() => {
    fetchAppointments();
    appointmentsCount(today)
      .then((data) => {
        setTotalAppointments(data.totalAppointments);
        setCancelledAppointments(data.cancelledAppointments);
      })
      .catch((error) => {
        console.error("Error fetching appointment counts:", error);
      });
  }, []);

  return (
    <>
      <Fragment>
        <Breadcrumbs mainTitle="Dashboard" />
        <Container fluid={true}>
          <Row className="widget-grid">
            <WidgetsWrapper
              totalAppointments={totalAppointments}
              cancelledAppointments={cancelledAppointments}
            />
            {isLoading ? (
              <TableSkeleton columns={6} rows={5} />
            ) : (
              <AppointmentsTable
                appointments={appointments}
                flowType={"dashBoard"}
              />
            )}
          </Row>
        </Container>
      </Fragment>
    </>
  );
};

export default Dashboard;
