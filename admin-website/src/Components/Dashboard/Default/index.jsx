import React, { Fragment } from "react";
import { Container, Row } from "reactstrap";
import { Breadcrumbs } from "../../../AbstractElements";
import WidgetsWrapper from "./WidgetsWraper";
import TableComponent from "../../Common/Component/TableComponent";
import { Hovertabledata } from "../../../Data/Table/bootstraptabledata";

const Dashboard = () => {
  return (
    <Fragment>
      <Breadcrumbs mainTitle="Dashboard" />
      <Container fluid={true}>
        <Row className="widget-grid">
          <WidgetsWrapper />
          <TableComponent
            title="Today Appointments"
            headers={[
              "Patient Name",
              "Doctor Name",
              "Date",
              "Time",
              "Status",
              "Action",
            ]}
            tableBody={
              <tbody>
                {Hovertabledata.map((item) => (
                  <tr key={item.id}>
                    <th scope="row">{item.id}</th>
                    <td className="d-flex align-items-center">
                      <span
                        className={`${item.bgClass} rounded-1 p-1 me-2 d-flex align-items-center`}
                      >
                        {item.icon}
                      </span>
                      {item.status}
                    </td>
                    <td>{item.signalName}</td>
                    <td>{item.security}</td>
                    <td>{item.stage}</td>
                    <td>{item.schedule}</td>
                  </tr>
                ))}
              </tbody>
            }
          />
        </Row>
      </Container>
    </Fragment>
  );
};

export default Dashboard;
