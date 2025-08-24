import React from "react";
import { Table } from "reactstrap";
import "./tableSkeleton.css"; // for shimmer effect

const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <Table bordered responsive>
      <thead>
        <tr>
          {Array.from({ length: columns }).map((_, i) => (
            <th key={i}>
              <div className="table_skeleton table_skeleton-header"></div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <td key={colIndex}>
                <div className="table_skeleton table_skeleton-cell"></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TableSkeleton;
