import React, { Fragment } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Input,
  Label,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import H3 from "../Headings/H3Element";
import DatePicker from "react-datepicker";
import { FaCalendarAlt, FaCrosshairs } from "react-icons/fa";
import { BsXLg } from "react-icons/bs";

const Breadcrumbs = ({
  mainTitle,
  buttonTitle,
  onClick,
  btnColor,
  searchText,
  searchChange,
  searchDate,
  setSearchDate,
  showDate,
}) => {
  return (
    <Fragment>
      <Container fluid={true}>
        {/* <div className="page-title">
          <Row>
            <Col
              md={searchText || showDate ? "4" : "6"}
              xs={12}
              sm={12}
              className="mb-2"
            >
              <H3>{mainTitle}</H3>
            </Col>
            {searchText && (
              <Col xs="4" className="">
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
            {showDate && (
              <Col md="4" xs={12} sm={12} className="my-2">
                <InputGroup className="">
                  <InputGroupText>
                    <span style={{ cursor: "pointer" }}>
                      <FaCalendarAlt color="#7366ff" />
                    </span>
                  </InputGroupText>
                  <DatePicker
                    selected={searchDate}
                    onChange={(date) => setSearchDate(date)}
                    className="form-control"
                    placeholderText="Search with date"
                    dateFormat="dd/MM/yyyy"
                    data-toggle="datetimepicker"
                  />
                  {searchDate && (
                    <InputGroupText className="bg-danger">
                      <span
                        className="btn p-0 border-none"
                        onClick={() => setSearchDate("")}
                      >
                        <BsXLg fontSize={"16px"} className="text-white" />
                      </span>
                    </InputGroupText>
                  )}
                </InputGroup>
              </Col>
            )}
            <Col
              md={"1"}
              xs={12}
              sm={12}
              className="text-center align-items-center"
            ></Col>
            <Col
              md={searchText || showDate ? "3" : "6"}
              xs={12}
              sm={12}
              className="align-items-center"
            >
              {buttonTitle && (
                <Button color={btnColor || "primary"} onClick={onClick}>
                  {buttonTitle}
                </Button>
              )}
            </Col>
          </Row>
        </div> */}
        <div className="page-title">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
            <div className="mb-2">
              <H3>{mainTitle}</H3>
            </div>
            {searchText && (
              <div className="mb-2">
                <Input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  aria-label="Search"
                  aria-describedby="search-addon"
                  value={searchText}
                  onChange={searchChange}
                />
              </div>
            )}
            {showDate && (
              <InputGroup
                className="mb-2 flex-nowrap"
                style={{ minWidth: "220px", maxWidth: "350px" }}
              >
                <InputGroupText className="d-inline">
                  <span style={{ cursor: "pointer" }}>
                    <FaCalendarAlt color="#7366ff" />
                  </span>
                </InputGroupText>
                <DatePicker
                  selected={searchDate}
                  onChange={(date) => setSearchDate(date)}
                  className="form-control d-inline"
                  placeholderText="Search with date"
                  dateFormat="dd/MM/yyyy"
                  data-toggle="datetimepicker"
                  wrapperClassName="w-100"
                />
                {searchDate && (
                  <InputGroupText className="bg-danger d-inline">
                    <span
                      className="btn p-0 border-0"
                      onClick={() => setSearchDate(null)}
                      style={{ minWidth: "24px" }}
                    >
                      <BsXLg fontSize={"16px"} className="text-white" />
                    </span>
                  </InputGroupText>
                )}
              </InputGroup>
            )}
            <div className="mb-2 d-flex justify-content-lg-end justify-content-center w-33">
              {buttonTitle && (
                <Button
                  color={btnColor || "primary"}
                  onClick={onClick}
                  className="w-100 w-lg-auto"
                >
                  {buttonTitle}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Fragment>
  );
};

export default Breadcrumbs;
