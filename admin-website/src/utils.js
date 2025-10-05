import { toast } from "react-toastify";

export const toasterConfig = (toastname, message) => {
  switch (toastname) {
    case "success":
      toast.success(message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      break;
    case "info":
      toast.info(message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      break;
    case "warning":
      toast.warn(message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      break;
    case "danger":
      toast.error(message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      break;
    default:
      break;
  }
};

// Utility to get roleID from localStorage userdetails
export function getRoleId() {
  let userDetails = {};
  try {
    userDetails = JSON.parse(localStorage.getItem('userDetails')) || {};
  } catch (e) {
    userDetails = {};
  }
  return Number(userDetails.roleID);
}
