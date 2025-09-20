import React, { useState } from "react";
import TableComponent from "../Common/Component/TableComponent";
import { Badges } from "../../AbstractElements";
import { format } from "date-fns";

const dropdownStyle = {
  position: "relative",
  display: "inline-block",
  marginLeft: "1rem",
};
const dropdownContentStyle = {
  display: "block",
  position: "absolute",
  backgroundColor: "#fff",
  minWidth: "160px",
  boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
  zIndex: 1,
  padding: "10px",
  border: "1px solid #eee",
};

const STATUS_OPTIONS = [
  { label: "Booked", value: "booked" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const AppointmentsTable = ({ appointments, flowType, title }) => {
  const [searchText, setSearchText] = useState("");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const handleStatusChange = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const sortedAppointments = [...appointments].sort((a, b) => {
    return a.appointmentID - b.appointmentID;
  });

  // Filter appointments based on searchText and selectedStatuses
  const filteredAppointments = sortedAppointments.filter((appointment) => {
    const search = searchText.toLowerCase();
    const matchesSearch =
      appointment.patientName?.toLowerCase().includes(search) ||
      appointment.doctorName?.toLowerCase().includes(search) ||
      String(appointment.appointmentID).includes(search) ||
      appointment.status?.toLowerCase().includes(search);

    const matchesStatus =
      selectedStatuses.length === 0 ||
      selectedStatuses.includes(appointment.status?.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  // const filteredAppointments = appointments.filter((appointment) => {
  //   const search = searchText.toLowerCase();
  //   return (
  //     appointment.patientName?.toLowerCase().includes(search) ||
  //     appointment.doctorName?.toLowerCase().includes(search) ||
  //     String(appointment.appointmentID).includes(search) ||
  //     appointment.status?.toLowerCase().includes(search)
  //   );
  // });

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
        {filteredAppointments?.length > 0 ? (
          filteredAppointments?.map((appointment) => (
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
