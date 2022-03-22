import React from "react";
import { Button, Typography, List } from "antd";

const Trigger = ({ triggerText, buttonRef, showModal }) => {
  return (
    <Button
      onClick={() => (window.location = "/admin/addoffice")}
      className="uploadOfficePlan"
      ref={buttonRef}
      onClick={showModal}
      type="primary"
      shape="round"
    >
      {triggerText}
    </Button>
  );
};
export default Trigger;
