import React, { useState } from "react";
import AddUserButton from "../AddUserButton/AddUserButton";
import { Modal } from "antd";
import RegisterUser from "../RegisterUser/RegisterUser";

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

      <Modal
        title="Create user"
        open={isShown}
        closable={true}
        onCancel={closeModal}
        onKeyDown={onKeyDown}
        footer={null}
        className="addUserModal"
      >
        <RegisterUser showRegisterForm={onSubmit} />
      </Modal>
    </>
  );
};

export default AddUsersContainer;
