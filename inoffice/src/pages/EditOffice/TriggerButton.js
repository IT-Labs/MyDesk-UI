import React from "react";
import { Button, Typography, List } from "antd";

const Trigger = ({ triggerText, buttonRef, showModal }) => {
  return (
    <Button
      onClick={() => (window.location = "/admin/addoffice")}
      className="uploadOfficePlan btn"
      style={{ width: 250 }}
      ref={buttonRef}
      onClick={showModal}
      type="primary"
    >
      {triggerText}
    </Button>
  );
};
export default Trigger;
