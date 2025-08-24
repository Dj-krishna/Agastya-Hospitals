import React from "react";
import TableComponent from "../Common/Component/TableComponent";
import { Badges } from "../../AbstractElements";
import { format } from "date-fns";

const AppointmentsTable = ({ appointments, flowType }) => {
  console.log("AppointmentsTable appointments:", appointments);
  const sortedAppointments = [...appointments].sort((a, b) => {
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
      headers={["#ID", "Patient Name", "Doctor Name", "Date", "Time", "Status"]}
      tableBody={renderTableBody()}
    />
  );
};

export default AppointmentsTable;
