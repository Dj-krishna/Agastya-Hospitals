import { Button } from "react-bootstrap";

function PageHeader({ title, buttonText, onButtonClick }) {
  return (
    <div
      className="page-header d-flex justify-content-between align-items-center mb-2"
      style={{ padding: "0 0.5rem" }}
    >
      <h4 className="fw-semibold" style={{ color: "#333" }}>
        {title}
      </h4>
      {buttonText && (
        <Button variant="primary" type="button" onClick={onButtonClick}>
          {buttonText}
        </Button>
      )}
    </div>
  );
}

export default PageHeader;
