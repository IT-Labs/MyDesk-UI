import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import { Select, Form, Spin } from "antd";
import { fetchAllOfficesApi } from "../../../services/office.service";
import { sortByName } from "../../../utils/sortByName";

const OfficeBranchSelection = (props) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const { Option } = Select;

  const fetchOffices = async () => {
    setLoading(true);

    const { data: response } = await fetchAllOfficesApi();
    const sorted = sortByName(response);

    if (response.length) {
      props.onOfficeBranchChange(sorted[0].id);
      setData(sorted);
    }
    setLoading(false);
  };

  const handleChange = (value) => {
    props.onOfficeBranchChange(value);
  };

  useEffect(() => {
    fetchOffices();
  }, []);

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
export default OfficeBranchSelection;
