function Dashboard() {
  return (
    <>
      <div className="mt-4">
        <h5>Upcoming Appointments</h5>
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Doctor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Jane Doe</td>
                <td>2024-06-15</td>
                <td>10:00 AM</td>
                <td>Dr. John Smith</td>
                <td>
                  <span className="badge bg-success">Confirmed</span>
                </td>
              </tr>
              <tr>
                <td>Michael Brown</td>
                <td>2024-06-16</td>
                <td>11:30 AM</td>
                <td>Dr. Emily Johnson</td>
                <td>
                  <span className="badge bg-warning text-dark">Pending</span>
                </td>
              </tr>
              <tr>
                <td>Sarah Lee</td>
                <td>2024-06-17</td>
                <td>09:00 AM</td>
                <td>Dr. Jane Smith</td>
                <td>
                  <span className="badge bg-danger">Cancelled</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
