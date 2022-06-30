import React from "react";
import Form from "../Form/Form";

import { Modal } from "antd";
export const Modals = ({ hideModal, imageUrl, visible }) => {
  return (
    <Modal
      maskClosable={false}
      title="Are you sure you want to cancel your reservation?"
      centered
      visible={visible}
      footer={null}
    >
      <Form imageUrl={imageUrl} hideModal={hideModal} />
    </Modal>
  );
};

export default Modals;
