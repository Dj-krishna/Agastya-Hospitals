import React, { Fragment } from "react";
import { Col, Card, CardHeader, Table } from "reactstrap";
import { H3, H4, H5 } from "../../../AbstractElements";

const TableComponent = ({ title, headers, tableBody }) => {
  return (
    <Fragment>
      <Col sm="12">
        <Card className="p-1">
          {title && (
            <CardHeader>
              <H5>{title}</H5>
            </CardHeader>
          )}
          <div className="table-responsive">
            <Table hover={true} className="table-border-horizontal">
              <thead className="table-dark">
                <tr>
                  {headers.map((header) => (
                    <th scope="col">{header}</th>
                  ))}
                </tr>
              </thead>
              {tableBody}
            </Table>
          </div>
        </Card>
      </Col>
    </Fragment>
  );
};

export default TableComponent;
