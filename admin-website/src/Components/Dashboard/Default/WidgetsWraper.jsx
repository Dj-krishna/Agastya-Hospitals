import React from "react";
import { Col, Row } from "reactstrap";
import SocialWidget from "../../Common/CommonWidgets/SocialWidget";
import { ca } from "date-fns/locale";

const WidgetsWrapper = ({ totalAppointments, cancelledAppointments }) => {
  const SocialWidgetDataWidgetPage = [
    {
      total: totalAppointments,
      subTitle: "Total Appointments",
      chart: {
        color: ["var(--theme-default)"],
      },
    },
    {
      total: cancelledAppointments,
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
