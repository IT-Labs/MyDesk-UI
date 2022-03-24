import React from "react";
import "antd/dist/antd.css";
import { Select, Form } from "antd";

const jobtitle = (props) => {
  const { Option } = Select;
  return (
    <Form.Item name="jobtitle"
    rules={[
      { required: true, message: "Please input your Job title!" },
      {
        message: "Wrong Format",
      },
    ]}>
      <Select className="custominput" placeholder="Job title">
        <Option value="dev">DEV</Option>
        <Option value="qa">QA</Option>
      </Select>
    </Form.Item>
  );
};
export default jobtitle;