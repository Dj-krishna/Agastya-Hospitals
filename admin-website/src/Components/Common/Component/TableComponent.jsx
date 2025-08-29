import React, { Fragment } from "react";
import { Col, Card, CardHeader, Table, Input, Row } from "reactstrap";
import { H3, H4, H5 } from "../../../AbstractElements";

const TableComponent = ({
  title,
  headers,
  tableBody,
  isSearch,
  searchText,
  onSearch,
  showStatusFilter,
  statusFilterComponent,
}) => {
  return (
    <Fragment>
      <Col sm="12">
        <Card className="p-1">
          {(title || isSearch || showStatusFilter) && (
            <CardHeader className="py-2">
              <Row>
                {title ? (
                  <Col md={4}>
                    <H5>{title}</H5>
                  </Col>
                ) : (
                  <Col md={4}></Col>
                )}
                {showStatusFilter ? (
                  <Col md={4}> {statusFilterComponent}</Col>
                ) : (
                  <Col md={4}></Col>
                )}
                {isSearch ? (
                  <Col md={4}>
                    <Input
                      name="search"
                      type="text"
                      value={searchText}
                      onChange={onSearch}
                      placeholder="Search here..."
                    />
                  </Col>
                ) : (
                  <Col md={4}></Col>
                )}
              </Row>
            </CardHeader>
          )}

          <div className="table-responsive">
            <Table hover={true} className="table-border-horizontal">
              <thead className="">
                <tr>
                  {headers.map((header) => (
                    <th scope="col" key={header}>
                      {header}
                    </th>
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
