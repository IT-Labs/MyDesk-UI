import React from "react";
import "antd/dist/antd.css";
import { Select, Form } from "antd";
import api from "../../../helper/api";
import { useEffect, useState } from "react";
import { Spin } from "antd";

const Officebranchselection = (props) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const { Option } = Select;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: response } = await api.get("employee/offices");

        const sorted = response.sort((a, b) => {
          return a.name < b.name ? -1 : 1;
        });

        if (response.length) {
          props.onOfficebranchChange(sorted[0].id);
          setData(sorted);
        }

      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleChange = (value) => {
    props.onOfficebranchChange(value);
  };

  return (
    <div>
      {loading && (
        <div>
          <Spin />
        </div>
      )}
      {!loading && (
        <Form.Item>
          <p className={props.styles}>Select office</p>
          <Select
            data-cy={props.dataCy}
            onChange={handleChange}
            placeholder="Select office-branch"
            defaultValue={data.length ? data[0].name : null}
            style={{ width: "18.75rem" }}
          >
            {data.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}
    </div>
  );
};
export default Officebranchselection;
