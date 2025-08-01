import React, { Fragment } from "react";
import { Container, Row } from "reactstrap";
import { Breadcrumbs } from "../../../AbstractElements";

import OverallBalance from "./OverallBalance";
import GreetingCard from "./GreetingCard";
import WidgetsWrapper from "./WidgetsWraper";
import RecentOrders from "./RecentOrders";
import ActivityCard from "./ActivityCard";
import RecentSales from "./RecentSales";
import TimelineCard from "./TimelineCard";
import PreAccountCard from "./PreAccountCard";
import TotalUserAndFollower from "./TotalUserAndFollower";
import PaperNote from "./PaperNote";
import TableComponent from "../../Common/Component/TableComponent";
import { Hovertabledata } from "../../../Data/Table/bootstraptabledata";

const Dashboard = () => {
  return (
    <Fragment>
      <Breadcrumbs
        mainTitle="Dashboard"
        // parent="Dashboard"
        // title="Default"
        // subParent="Dashboard"
      />
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
