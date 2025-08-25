import React, { useState } from "react";
import TableComponent from "../Common/Component/TableComponent";
import { Badges } from "../../AbstractElements";
import { format } from "date-fns";

const AppointmentsTable = ({ appointments, flowType, title }) => {
  const [searchText, setSearchText] = useState("");
  console.log("AppointmentsTable appointments:", appointments);
  const filteredAppointments = appointments.filter((appointment) => {
    const search = searchText.toLowerCase();
    return (
      appointment.patientName?.toLowerCase().includes(search) ||
      appointment.doctorName?.toLowerCase().includes(search) ||
      String(appointment.appointmentID).includes(search)
    );
  });

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    return a.appointmentID - b.appointmentID;
  });
  const renderTableBody = () => {
    const statusBg = (appStatus) => {
      switch (appStatus) {
        case "booked":
          return "info";
        case "completed":
          return "success";
        case "cancelled":
          return "danger";
        default:
          return "secondary";
      }
    };
    return (
      <tbody>
        {sortedAppointments?.length > 0 ? (
          sortedAppointments?.map((appointment) => (
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
                    color: statusBg(appointment.status),
                  }}
                >
                  {appointment.status}
                </Badges>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="text-center">
              No appointments found
            </td>
          </tr>
        )}
      </tbody>
    );
  };
  return (
    <TableComponent
      title={title}
      headers={["#ID", "Patient Name", "Doctor Name", "Date", "Time", "Status"]}
      tableBody={renderTableBody()}
      isSearch={true}
      searchText={searchText}
      onSearch={(e) => setSearchText(e.target.value)}
    />
  );
};

export default AppointmentsTable;
