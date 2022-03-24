import React from "react";
import { Form, Input } from "antd";


const emailcomponent = (props) => {
  return (
    <Form.Item
      name="email"
      rules={[
        { required: true, message: "Please input your Email!" },
        {
          required: true,
          pattern: new RegExp(
            "^[a-z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+.)?[a-zA-Z]+.)?(inoffice).com$"
          ),
          message: "Wrong Format",
        },
      ]}
    >
      <Input className="custominput" placeholder="Email" />
    </Form.Item>
  );
};

export default emailcomponent;
