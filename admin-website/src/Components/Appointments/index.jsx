import React, { Fragment, useEffect, useState } from "react";
import { Badges, Breadcrumbs } from "../../AbstractElements";
import { Container, Row } from "reactstrap";
import axios from "axios";
import { APPOINTMENTS_API } from "../../api";
import AppointmentsForm from "./AppointmentsForm";
import AppointmentsTable from "./AppointmentsTable";
import TableSkeleton from "../Common/Component/TableSkeleton";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [searchDate, setSearchDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (date) => {
    setSearchDate(date);
    fetchAppointments(date);
  };

  const fetchAppointments = async (date) => {
    setIsLoading(true);
    const dateParam = date ? `?date=${date}` : "";
    try {
      const response = await axios.get(APPOINTMENTS_API + dateParam);
      if (response.data.appointments) {
        setAppointments(response.data.appointments);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(true);
      console.error("Error fetching appointments:", error);
    } finally {
      setIsLoading(false);
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
            showDate={true}
          />

          <Container fluid={true}>
            <Row className="widget-grid">
              {isLoading ? (
                <TableSkeleton columns={6} rows={5} />
              ) : (
                <AppointmentsTable appointments={appointments} />
              )}
            </Row>
          </Container>
        </>
      ) : (
        <AppointmentsForm
          onClose={() => setShowAddAppointment(false)}
          onAppointmentAdded={(newAppointment) => {
            setAppointments((prev) => [...prev, newAppointment]);
            setShowAddAppointment(false);
          }}
        />
      )}
    </Fragment>
  );
};

export default Appointments;
