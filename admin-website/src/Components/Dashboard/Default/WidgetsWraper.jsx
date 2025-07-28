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
import { SocialWidgetDataWidgetPage } from "../../../Data/Social";
import SocialWidget from "../../Common/CommonWidgets/SocialWidget";

const WidgetsWrapper = () => {
  return (
    <>
      {/* <Col xxl="auto" xl="12" sm="6" className="box-col-6">
        <Row>
          <Col xxl="12" xl="6" className="box-col-12">
            <Widgets1 data={WidgetsData4} />
          </Col>
          <Col xxl="12" xl="6" className="box-col-12">
            <Widgets1 data={WidgetsData3} />
          </Col>
        </Row>
      </Col> */}
      {SocialWidgetDataWidgetPage.map((item, i) => (
        <Col xxl='6' xl="4" sm="6" key={i}>
          <SocialWidget data={item} />
        </Col>
      ))}
      {/* <Col xxl='auto' xl='6' sm='12' className='box-col-6'>
        <Row>
          <Col xl='6'>
            <Widgets1 data={WidgetsData3} />
          </Col>
          <Col xl='6'>
            <Widgets1 data={WidgetsData4} />
          </Col>
        </Row>
      </Col> */}
      {/* <Col xxl='auto' xl='12' sm='6' className='box-col-6'>
        <Row>
          <Col xxl='12' xl='6' className='box-col-12'>
            <Widgets2 data={Widgets2Data} />
          </Col>
          <Col xxl='12' xl='6' className='box-col-12'>
            <Widgets2 chartClass='profit-chart ' data={Widgets2Data2} />
          </Col>
        </Row>
      </Col> */}
    </>
  );
};

export default WidgetsWrapper;
