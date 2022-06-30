import React from "react";
import { Button } from "antd";

const Trigger = ({ triggerText, buttonRef, showModal }) => {
  return (
    <Button
      onClick={showModal}
      className="uploadOfficePlan btn"
      style={{ width: 250 }}
      ref={buttonRef}
      type="primary"
    >
      {triggerText}
    </Button>
  );
};
export default Trigger;
