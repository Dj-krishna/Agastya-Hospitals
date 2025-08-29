import React from "react";
import {
  Card,
  CardBody,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";

const PaginationComponent = ({ currentPage, totalPages, handlePageChange }) => {
  return (
      <Pagination className="pagination-primary" style={{ float: "right", marginTop:"-30px" }}>
        <PaginationItem disabled={currentPage === 1}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage - 1);
            }}
          >
            «
          </PaginationLink>
        </PaginationItem>

        {Array.from({ length: totalPages }).map((_, index) => (
          <PaginationItem key={index} active={index + 1 === currentPage}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(index + 1);
              }}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem disabled={currentPage === totalPages}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage + 1);
            }}
          >
            »
          </PaginationLink>
        </PaginationItem>
      </Pagination>
  );
};

export default PaginationComponent;
