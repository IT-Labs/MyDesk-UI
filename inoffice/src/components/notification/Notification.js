import { notification } from "antd";

export const openNotification = (description) => {
  notification.info({
    message: "Notification",
    description,
    duration: 3,
    placement: "top",
  });
};

export const openError = (description) => {
  notification.error({
    message: "Error",
    description,
    duration: 3,
    placement: "top",
  });
};
