import React from "react";

import { Button } from "antd";

import { openNotification, openError } from "./Notification";

export default {
  title: "Notifications",
  component: Button,
};

export const Notifications = () => {
  return (
    <div>
      <p>These are the notification components</p>
      <Button
        type="primary"
        onClick={() => openNotification("Test Notification")}
      >
        Click for notification
      </Button>
      <Button type="primary" danger onClick={() => openError("Test Error")}>
        Click for error
      </Button>
    </div>
  );
};
