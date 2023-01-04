import React from "react";
import { Button } from "antd";

const AddUserButton = ({ addUserTextBtn, buttonRef, showModal }) => {
  return (
    <Button
      className="btn"
      block
      onClick={() => {
        showModal();
      }}
      id="addButton"
      ref={buttonRef}
      type="primary"
    >
      {addUserTextBtn}
    </Button>
  );
};
export default AddUserButton;
