import React from "react";
import AddOfficeContainer from "./AddOfficeContainer/AddOfficeContainer";

const Title = ({ addOfficeText, onSubmit, mediaMatches }) => {
  return (
    <div
      style={{
        display: !mediaMatches ? "flex" : "block",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <p style={{ fontSize: "1.125rem" }}>Offices</p>
      <AddOfficeContainer
        id="addButton"
        addOfficeText={addOfficeText}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default Title;
