import React from "react";
import TableComponent from "../Common/Component/TableComponent";
import { Badges } from "../../AbstractElements";
import { format } from "date-fns";

const AppointmentsTable = ({ appointments, flowType }) => {
  const renderTableBody = () => {
    return (
      <tbody>
        {appointments?.length > 0 ? (
          appointments?.map((appointment) => (
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
                    color:
                      appointment.status === "booked" ? "success" : "danger",
                  }}
                >
                  {appointment.status}
                </Badges>
              </td>
              {!(flowType === "dashBoard") && (
                <td>
                  <button className="btn btn-primary">View</button>
                </td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="text-center">No appointments found</td>
          </tr>
        )}
      </tbody>
    );
  };
  return (
    <TableComponent
      headers={[
        "Appointment ID",
        "Patient Name",
        "Doctor Name",
        "Date",
        "Time",
        "Status",
        !(flowType === "dashBoard") && "Action",
      ]}
      tableBody={renderTableBody()}
    />
  );
};

export default AppointmentsTable;
