import React, { Fragment, useEffect, useState } from "react";
import { Badges, Breadcrumbs } from "../../AbstractElements";
import { Container, Row } from "reactstrap";
import TableComponent from "../Common/Component/TableComponent";
import axios from "axios";
import { APPOINTMENTS_API } from "../../api";
import { format } from "date-fns";
import AppointmentsForm from "./AppointmentsForm";
import AppointmentsTable from "./AppointmentsTable";
import TableSkeleton from "../Common/Component/TableSkeleton";
import PaginationComponent from "../Common/Component/PaginationComponent";

const today = new Date();
const ITEMS_PER_PAGE = 7;
const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [searchDate, setSearchDate] = useState(today);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.ceil(appointments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = appointments.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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
              {isLoading ? (
                <TableSkeleton columns={6} rows={5} />
              ) : (
                <AppointmentsTable appointments={currentData} />
              )}
                <PaginationComponent
                  currentPage={currentPage}
                  totalPages={totalPages}
                  handlePageChange={handlePageChange}
                />
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
