import React from "react";
import { Button, Typography, List } from "antd";

const showModalFunc = () => {};

const Trigger = ({ addOfficeText, buttonRef, showModal }) => {
  return (
    <Button
      style={{
        background: "white",
        color: "teal",
        border: "1px solid teal",
        borderRadius: "5px",
      }}
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
