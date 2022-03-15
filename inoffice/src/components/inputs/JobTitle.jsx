import React from "react";
import "antd/dist/antd.css";
import { Select, Form } from "antd";

const jobtitle = (props) => {
  const { Option } = Select;
  return (
    <Form.Item name="jobtitle">
      <Select style={{ width: 120 }}>
        <Option value="qa">QA</Option>
        <Option value="dev">DEV</Option>
      </Select>
    </Form.Item>
  );
};
export default jobtitle;