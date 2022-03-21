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
              return Promise.reject("Password does not match");
            },
          }),
        ]}
      >
        <Input.Password className="custominput" placeholder="Confirm Password" />
      </Form.Item> 
    );
  };
  export default confirmpassword;