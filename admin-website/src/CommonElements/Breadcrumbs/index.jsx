import React, { Fragment } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Input,
  Label,
  InputGroup,
} from "reactstrap";
import H3 from "../Headings/H3Element";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import { Info } from "react-feather";

const Breadcrumbs = ({
  mainTitle,
  buttonTitle,
  onClick,
  btnColor,
  searchText,
  searchChange,
  searchDate,
  setSearchDate,
}) => {
  return (
    <Fragment>
      <Container fluid={true}>
        <div className="page-title">
          <Row>
            <Col xs={searchText || searchDate ? "4" : "6"}>
              <H3>{mainTitle}</H3>
            </Col>
            {searchText && (
              <Col xs="4" className="text-center">
                <Input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  aria-label="Search"
                  aria-describedby="search-addon"
                  searchText={searchText}
                  onChange={searchChange}
                />
              </Col>
            )}
            {searchDate && (
              <Col xs="4" className="text-right">
                <InputGroup className="">
                  <DatePicker
                    selected={searchDate}
                    onChange={(date) => setSearchDate(date)}
                    className="form-control"
                    placeholderText="Select Date"
                    dateFormat="dd/MM/yyyy"
                    data-toggle="datetimepicker"
                  />
                  <div
                    className="input-group-text"
                    data-target="#dt-date"
                    data-toggle="datetimepicker"
                  >
                    <FaCalendarAlt />
                  </div>
                </InputGroup>
              </Col>
            )}
            <Col
              xs={searchText || searchDate ? "4" : "6"}
              className="text-end align-items-center"
            >
              {buttonTitle && (
                <Button color={btnColor || "primary"} onClick={onClick}>
                  {buttonTitle}
                </Button>
              )}
            </Col>
          </Row>
        </div>
      </Container>
    </Fragment>
  );
};

export default Breadcrumbs;
