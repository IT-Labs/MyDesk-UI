import React from "react";
import { Form, Input } from "antd";

const lastname = (props) => {
  return (
    <Form.Item
      name="lastname"
      rules={[
        { required: true, message: "Please input your Last name!" },
        {
          required: true,
          pattern: new RegExp("^[A-Za-z -]+$"),
          message: " ",
        },
      ]}
    >
      <Input className="custominput" placeholder="Last name" />
    </Form.Item>
  );
};

export default lastname;
