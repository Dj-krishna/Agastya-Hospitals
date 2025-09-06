import { toast } from "react-toastify";

const toastTypes = {
  success: toast.success,
  info: toast.info,
  warning: toast.warn,
  danger: toast.error,
};

export const toasterConfig = (type, message) => {
  const showToast = toastTypes[type];
  if (showToast) {
    showToast(message, {
      position: "top-right",
      autoClose: 5000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: `custom-toast-${type}`,
    });
  }
};
