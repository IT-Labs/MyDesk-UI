import React from "react";
import "antd/dist/antd.css";
import { Select, Form } from "antd";

const Availability = (props) => {
  const { Option } = Select;

  return (
    <Form.Item>
      <p style={{ fontSize: "1.2em", fontWeight: "bold" }}>Availability</p>
      <Select placeholder="Select availability">
        <Option value="Available">Available</Option>
        <Option value="Notavailable">Not available</Option>
      </Select>
    </Form.Item>
  );
};
export default Availability;
