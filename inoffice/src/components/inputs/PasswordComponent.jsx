import React from "react";
import { Form, Input } from "antd";

const passwordcomponent = (props) => {
  return (
    <Form.Item 
      name="password"
      rules={[
        {
          required: true,
          message: "Please input your Password!",
        },
        {
          required: false,
          pattern: new RegExp(
            "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
          ),
          message: " ",
        },
      ]}
      hasFeedback
    >
      <Input.Password className="custominput" placeholder="Password" />
    </Form.Item>
  );
};
export default passwordcomponent;
