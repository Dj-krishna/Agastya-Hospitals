import React, { Fragment } from 'react';
import { Col, Card, CardHeader, Table } from 'reactstrap';
import { H3 } from '../../../AbstractElements';

const TableComponent = ({ title, headers, data }) => {
  return (
    <Fragment>
      <Col sm='12'>
        <Card>
          <CardHeader>
            <H3>{title}</H3>
          </CardHeader>
          <div className='table-responsive'>
            <Table hover={true} className='table-border-horizontal'>
              <thead>
                <tr>
                  {headers.map((header) => (
                    <th scope='col'>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <th scope='row'>{item.id}</th>
                    <td className='d-flex align-items-center'>
                      <span className={`${item.bgClass} rounded-1 p-1 me-2 d-flex align-items-center`}>{item.icon}</span>
                      {item.status}
                    </td>
                    <td>{item.signalName}</td>
                    <td>{item.security}</td>
                    <td>{item.stage}</td>
                    <td>{item.schedule}</td>
                    <td>{item.teamLead}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      </Col>
    </Fragment>
  );
};

export default TableComponent;
