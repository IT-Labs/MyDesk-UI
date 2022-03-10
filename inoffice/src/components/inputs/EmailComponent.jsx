import React from "react";
import { Form, Input } from "antd";

const emailcomponent = (props) => {
  return (
    <Form.Item
      name="email"
      rules={[
        { required: true, message: "Please input your Username!" },
        {
          required: true,
          pattern: new RegExp(
            "^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+.)?[a-zA-Z]+.)?(inoffice).com$"
          ),
          message: "Wrong Format",
        },
      ]}
    >
      <Input placeholder="Email" />
    </Form.Item>
  );
};

export default emailcomponent;
