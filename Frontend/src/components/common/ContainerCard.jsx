import { Card } from "react-bootstrap";

const ContainerCard = ({ children, bgNone }) => {
  return bgNone ? (
    <div className="border-0 container_card">{children}</div>
  ) : (
    <Card className="border-0 shadow rounded-4 container_card">
      {children}
    </Card>
  );
};

export default ContainerCard;
