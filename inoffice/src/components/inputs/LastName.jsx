import React from "react";
import { Form, Input } from "antd";

const lastname = (props) => {
  return (
    <Form.Item
      name="lastname"
      rules={[
        { required: true, message: "Please input your Lastname!" },
        {
          required: true,
          pattern: new RegExp("^[A-Za-z -]+$"),
          message: "Wrong Format",
        },
      ]}
    >
      <Input placeholder="Lastname" />
    </Form.Item>
  );
};

export default lastname;
