import React from "react";
import AddOfficeContainer from "./AddOfficeContainer";

const Title = ({ addOfficeText, onSubmit }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <p>Offices</p>
      <AddOfficeContainer
        id="addOffice"
        addOfficeText={addOfficeText}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default Title;
