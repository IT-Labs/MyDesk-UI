import React from "react";
import AddUsersContainer from "./AddUsersContainer/AddUsersContainer";

const Title = ({ officeName, addUserTextBtn, onSubmit }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <p style={{ fontSize: "1.125rem" }}>{officeName}</p>
      <AddUsersContainer
        id="addButton"
        addUserTextBtn={addUserTextBtn}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default Title;
