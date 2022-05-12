import React from "react";
import { Button, Typography, List } from "antd";

const showModalFunc = () => {};

const Trigger = ({ addOfficeText, buttonRef, showModal }) => {
  return (
    <Button
      style={{
        background: "white",
        color: "teal",
        border: "0",
        borderRadius: "5px",
        boxShadow: " 0px 3px 6px #2C28281C",
      }}
      block
      onClick={() => {
        window.location = "/admin/addoffice";
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
