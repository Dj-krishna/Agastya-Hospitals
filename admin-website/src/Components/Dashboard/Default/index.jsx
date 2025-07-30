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
             "Patient Name", "Doctor Name", "Date", "Time", "Status", "Action"
            ]}
            data={Hovertabledata}
          />
        </Row>
      </Container>
    </Fragment>
  );
};

export default Dashboard;
