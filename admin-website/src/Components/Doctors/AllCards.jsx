import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, Col } from "reactstrap";
import axios from "axios";
import { H5, Image } from "../../AbstractElements";
import SvgIcon from "../Common/Component/SvgIcon";
import SocialLinks from "../Application/Users/UsersCards/SocialLinks";
import SocialData from "../Application/Users/UsersCards/SocialData";
import { DOCTORS_API } from "../../api";
import { fetchDataGet } from "../../api/Services";
// import images from '../../assets/images'

const AllCards = () => {
  const [cards, setCards] = useState([]);
  useEffect(() => {
    const ac = new AbortController();
    fetchDataGet(DOCTORS_API).then((res) => setCards(res));
    return () => ac.abort();
  }, []);
  console.log("DOCTOR CARDS ", cards);

  return (
    <Fragment>
      {cards.map((item) => {
        return (
          <Col
            key={item.id}
            xl="4"
            sm="6"
            xxl="3"
            className="col-ed-4 box-col-4"
          >
            <Card className="social-profile">
              <CardBody>
                <div className="social-img-wrap">
                  <div className="social-img">
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        background: "#e0e0e0",
                        fontWeight: "bold",
                        fontSize: 22,
                        color: "#333",
                        margin: "0 auto",
                      }}
                    >
                      {(
                        item.fullName.split(" ")[1].split("")[0] +
                        item.fullName.split(" ")[2].split("")[0]
                      ).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="social-details">
                  <H5 attrH5={{ className: "mb-3" }}>{item.fullName}</H5>
                  <div className="d-flex justify-content-between my-2">
                    <span className="font-lite">Designation</span>
                    <span className="font-lite">{item.designation}</span>
                  </div>
                  <div className="d-flex justify-content-between my-2">
                    <span className="font-lite">Years of Experience</span>
                    <span className="font-lite">
                      {item.yearsOfExperience || "-"} Years
                    </span>
                  </div>
                  <div className="d-flex justify-content-between my-2">
                    <span className="font-lite">Gender</span>
                    <span className="font-lite">{item.gender}</span>
                  </div>
                  <div className="d-flex justify-content-between my-2">
                    <span className="font-lite">Contact Number</span>
                    <span className="font-lite">
                      {item?.countryCode}
                      {item?.countryCode && " - "}
                      {item.mobile}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between my-2">
                    <span className="font-lite">Email Address</span>
                    <span className="font-lite">{item.email}</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        );
      })}
    </Fragment>
  );
};
export default AllCards;
