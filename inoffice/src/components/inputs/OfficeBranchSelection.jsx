import React from "react";
import "antd/dist/antd.css";
import { Select, Form } from "antd";
import api from "../../helper/api";
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
        setData(response);
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  function handleChange(value) {
    props.onOfficebranchChange(value);
  }

  return (
    <div>
      {loading && (
        <div>
          <Spin />
        </div>
      )}
      {!loading && (
        <Form.Item>
          <p style={{ fontSize: "1.2em", fontWeight: "bold" }}>
            Office - branch
          </p>
          <Select onChange={handleChange} placeholder="Select office-branch">
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
