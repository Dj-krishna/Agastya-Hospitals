import React from "react";
import { Col, Row } from "reactstrap";
import {
  Widgets2Data,
  Widgets2Data2,
  WidgetsData,
  WidgetsData2,
  WidgetsData3,
  WidgetsData4,
} from "../../../Data/DefaultDashboard";
import Widgets1 from "../../Common/CommonWidgets/Widgets1";
import Widgets2 from "../../Common/CommonWidgets/Widgets2";
import SocialWidget from "../../Common/CommonWidgets/SocialWidget";

const WidgetsWrapper = () => {
  const SocialWidgetDataWidgetPage = [
    {
      total: 12_098,
      subTitle: "Total Appointments",
      chart: {
        color: ["var(--theme-default)"],
      },
    },
    {
      total: 15_080,
      subTitle: "Cancelled Appointments",
      chart: {
        color: ["#FFA941"],
      },
    },
  ];
  return (
    <>
      {SocialWidgetDataWidgetPage.map((item, i) => (
        <Col xxl="6" xl="4" sm="6" key={i}>
          <SocialWidget data={item} />
        </Col>
      ))}
    </>
  );
};

export default WidgetsWrapper;
