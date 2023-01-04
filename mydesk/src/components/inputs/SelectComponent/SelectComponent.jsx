import React, { useState } from "react";
import "antd/dist/antd.css";
import { Select, Input } from "antd";

import styles from "./SelectComponent.module.scss";
import { ShoppingOutlined } from "@ant-design/icons";

const SelectComponent = (props) => {
  const [selectedItem, setSelectedItem] = useState("");

  const onSelectChange = (itemSelected) => {
    setSelectedItem(itemSelected);
    props.onSelectChange(itemSelected);
  };

  return (
    <div id="job">
      <Input.Group
        placeholder="Job Title"
        prefix={<ShoppingOutlined className="site-form-item-icon" />}
      >
        <Select
          placeholder={
            <React.Fragment>
              <ShoppingOutlined className="site-form-item-icon" />
              &nbsp; Job Title
            </React.Fragment>
          }
          showSearch
          allowClear
          optionLabelProp="label"
          className={styles.input}
          onChange={(e) => onSelectChange(e)}
          getPopupContainer={() => document.getElementById("job")}
          dropdownAlign={{ offset: [30] }}
        >
          {props.data.map((item) => (
            <Select.Option
              key={item.title}
              value={item.title}
              label={
                <React.Fragment>
                  <ShoppingOutlined className="site-form-item-icon" />
                  &nbsp;
                  {item.title}
                </React.Fragment>
              }
            ></Select.Option>
          ))}
        </Select>
      </Input.Group>
    </div>
  );
};
export default SelectComponent;
