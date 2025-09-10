import React, { Fragment, useEffect, useState } from "react";
import { Card, CardBody, Col } from "reactstrap";
import { H5, Image } from "../../AbstractElements";
import { DOCTORS_API } from "../../api";
import { fetchDataGet } from "../../api/Services";
import CardSkeleton from "../Common/Component/CardSkeleton";

const AllCards = ({ onEditDoctor, refreshTrigger = 0 }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await fetchDataGet(DOCTORS_API);
      setCards(data.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [refreshTrigger]);

  console.log("DOCTOR CARDS ", cards);

  const handleCardClick = (doctor) => {
    if (onEditDoctor) {
      onEditDoctor(doctor);
    }
  };

  if (loading) {
    return <CardSkeleton count={6} />;
  }

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
            <Card
              className="social-profile"
              style={{ cursor: "pointer" }}
              onClick={() => handleCardClick(item)}
            >
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
                        item.fullName.split(" ")[1]?.split("")[0] +
                        item.fullName.split(" ")[2]?.split("")[0]
                      ).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="social-details">
                  <H5 attrH5={{ className: "mb-3" }}>{item.fullName}</H5>
                  <div className="d-flex justify-content-between my-2">
                    <span className="font-lite f-12">Designation:</span>
                    <span className="font-lite f-12">{item.designation}</span>
                  </div>
                  <div className="d-flex justify-content-between my-2">
                    <span className="font-lite f-12">Years of Experience:</span>
                    <span className="font-lite f-12">
                      {item.yearsOfExperience || "-"} Years
                    </span>
                  </div>
                  <div className="d-flex justify-content-between my-2">
                    <span className="font-lite f-12">Gender:</span>
                    <span className="font-lite f-12">{item.gender}</span>
                  </div>
                  <div className="d-flex justify-content-between my-2">
                    <span className="font-lite f-12">Contact Number:</span>
                    <span className="font-lite f-12">
                      {item?.countryCode}
                      {item?.countryCode && " - "}
                      {item.mobile}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between my-2">
                    <span className="font-lite f-12">Email Address:</span>
                    <span className="font-lite f-12">{item.email}</span>
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
