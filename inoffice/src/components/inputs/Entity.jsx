import React from "react";
import "antd/dist/antd.css";
import {Select, Form } from "antd";


const Entity = () => {
     const { Option } = Select;

  return (
      <Form.Item>
        <label>Entity</label>
        <Select placeholder="Entity">
            <Option value="Desk">
                Desk
            </Option>
            <Option value="Conferenceroom">
                Conference room
            </Option>
        </Select>
      </Form.Item>
  )    
}
export default Entity;
