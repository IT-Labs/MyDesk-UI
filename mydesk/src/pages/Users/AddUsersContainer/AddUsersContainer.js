import React, { useState } from "react";
import RegisterModal from "../RegisterModal";
import AddUserButton from "../AddUserButton/AddUserButton";

const AddUsersContainer = (props) => {
  const [isShown, setIsShown] = useState(false);

  const showModal = () => {
    setIsShown(true);
  };

  const closeModal = () => {
    setIsShown(false);
  };

  const onKeyDown = (event) => {
    if (event.keyCode === 27) {
      this.closeModal();
    }
  };

  const onSubmit = (event) => {
    setIsShown(false);
    props.onSubmit();
  };

  return (
    <>
      <AddUserButton
        showModal={showModal}
        buttonRef={(n) => {
          return n;
        }}
        addUserTextBtn={props.addUserTextBtn}
      />
      {isShown ? (
        <RegisterModal
          onSubmit={onSubmit}
          closeModal={closeModal}
          onKeyDown={onKeyDown}
        />
      ) : null}
    </>
  );
};

export default AddUsersContainer;
