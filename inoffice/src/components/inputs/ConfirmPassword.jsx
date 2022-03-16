import React from "react";
import { Form, Input } from "antd";
import { PasswordComponent } from "../inputs/PasswordComponent"
 
const confirmpassword = (props) => {
    return (
        <Form.Item
        name="confirmpassword"
        dependencies={["PasswordComponent"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please input your Password!",
          },
          ({ getFieldValue }) =>({
            validator(_,value){
              if(!value || getFieldValue("password") === value){
                return Promise.resolve();
              }
              return Promise.reject("Passowrds do not match!");
            },
          }),
        ]}
      >
        <Input.Password placeholder="Confirm password" />
      </Form.Item> 
    );
  };
  export default confirmpassword;