import React from "react";
import { Form, Input } from "antd";

const firstname = (props) => {
  return (
    <Form.Item
      name="firstname"
      rules={[
        { required: true, message: "Please input your First name!" },
        {
          required: true,
          pattern: new RegExp("^[A-Za-z -]+$"),
          message: " ",
        },
      ]}
    >
      <Input
        autoComplete="off"
        className="custominput"
        placeholder="First name"
      />
    </Form.Item>
  );
};

export default firstname;
