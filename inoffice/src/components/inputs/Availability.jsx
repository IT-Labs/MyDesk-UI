import React from "react";
import "antd/dist/antd.css";
import {Select, Form} from "antd";


const Availability = () => {
     const { Option } = Select;

  return (
      <Form.Item>
          <label>Availability</label>
        <Select placeholder="Available">
            <Option value="Available">
                Available
            </Option>
            <Option value="Notavailable">
                Not available
            </Option>
        </Select>
      </Form.Item>
  )    
}
export default Availability;
