import React from 'react';
import { Card, CardBody } from 'reactstrap';
import { Image, H5 } from '../../../AbstractElements';
import RadialChart from './RadialChart';

const SocialWidget = ({ data }) => {
  return (
    <Card className='social-widget widget-hover'>
      <CardBody>
        <div className='text-center'>
          <div className={data.subTitle === "Total Appointments" ? 'font-success': "font-danger"}>
            <H5 attrH5={{ className: 'mb-1' }}>{data.total}</H5>
            <span className='f-light f-w-600'>{data.subTitle}</span>
          </div>
          <div className='social-chart' style={{display: 'none'}}>
            <RadialChart chartData={data.chart} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default SocialWidget;
