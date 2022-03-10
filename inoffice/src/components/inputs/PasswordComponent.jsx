import React from "react";

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
          message:
            "Password length must be between 8 and 20 characters, contains a minimum of 1 special character, 1 lowercase, 1 uppercase and a number!",
        },
      ]}
    >
      <Input.Password placeholder="Password" />
    </Form.Item>
  );
};
export default passwordcomponent;
