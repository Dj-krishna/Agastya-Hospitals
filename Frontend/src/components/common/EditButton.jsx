import { Button } from "react-bootstrap";
import { BiEditAlt } from "react-icons/bi";

const EditButton = ({ onClick }) => {
  return (
    <Button
      variant="primary"
      size="sm"
      className="rounded-circle"
      onClick={onClick}
    >
      <BiEditAlt />
    </Button>
  );
};

export default EditButton;
