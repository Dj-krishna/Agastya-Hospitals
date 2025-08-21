import React from "react";
import { Col, Row } from "reactstrap";
import SocialWidget from "../../Common/CommonWidgets/SocialWidget";

const WidgetsWrapper = ({ totalAppointments, cancelledAppointments }) => {
  const SocialWidgetDataWidgetPage = [
    {
      total: 12098,
      subTitle: "Total Appointments",
      chart: {
        color: ["var(--theme-default)"],
      },
    },
    {
      total: 15080,
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
