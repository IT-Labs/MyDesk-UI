import React from "react";
import { Button } from "antd";

const Trigger = ({ addOfficeText, buttonRef, showModal }) => {
  return (
    <Button
      className="btn"
      data-cy="addoffice-button"
      block
      onClick={() => {
        showModal();
      }}
      id="addButton"
      ref={buttonRef}
      type="primary"
    >
      {addOfficeText}
    </Button>
  );
};
export default Trigger;
