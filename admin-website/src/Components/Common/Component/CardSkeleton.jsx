import React from "react";
import { Card, CardBody } from "reactstrap";
import "./cardSkeleton.css";

const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="d-flex flex-wrap gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} style={{ width: "18rem" }}>
          <div className="card_skeleton card_skeleton-img"></div>
          <CardBody>
            <div className="card_skeleton card_skeleton-title"></div>
            <div className="card_skeleton card_skeleton-text"></div>
            <div className="card_skeleton card_skeleton-text short"></div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default CardSkeleton;
