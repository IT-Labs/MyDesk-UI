import React from "react";
import { Button, Typography, List } from "antd";

const showModalFunc = () => {};

const Trigger = ({ addOfficeText, buttonRef, showModal }) => {
  return (
    <Button
      className="btn"
      block
      onClick={() => {
        // window.location = "/admin/addoffice";
        showModal();
      }}
      id="addOffice"
      ref={buttonRef}
      type="primary"
    >
      {addOfficeText}
    </Button>
  );
};
export default Trigger;
