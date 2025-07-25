import { Button } from "react-bootstrap";
import { BiTrash } from "react-icons/bi";

const DeleteButton = ({ onClick }) => {
  return (
    <Button
      variant="danger"
      size="sm"
      className="rounded-circle"
      onClick={onClick}
    >
      <BiTrash />
    </Button>
  );
};

export default DeleteButton;
