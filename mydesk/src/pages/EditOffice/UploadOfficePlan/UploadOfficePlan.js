import React, { useState } from "react";
import Modal from "../Modal/Modal";
import TriggerButton from "../TriggerButton/TriggerButton";

const UploadOfficePlan = (props) => {
  const [visible, setVisible] = useState(false);
  const showModal = () => {
    setVisible(true);
  };
  const hideModal = () => {
    setVisible(false);
    props.getNewProps();
  };
  return (
    <React.Fragment>
      <TriggerButton showModal={showModal} triggerText={props.triggerText} />
      {visible ? (
        <Modal
          visible={visible}
          hideModal={hideModal}
          imageUrl={props.imageUrl}
        />
      ) : null}
    </React.Fragment>
  );
};

export default UploadOfficePlan;
