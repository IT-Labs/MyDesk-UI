import React from "react";
import AddOfficeContainer from "./AddOfficeContainer/AddOfficeContainer";

const Title = ({ addOfficeText, onSubmit }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <p style={{ fontSize: "1.125rem" }}>Offices</p>
      <AddOfficeContainer
        id="addOffice"
        addOfficeText={addOfficeText}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default Title;
