import React from "react";
import "antd/dist/antd.css";
import { Form } from "antd";
import api from "../../helper/api";
import { useEffect, useState } from "react";
import { Image } from "antd";
import { Spin } from "antd";

const OfficeImage = (props) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (props.officeid) {
        const { data: response } = await api.get(
          "employee/office/image/" + props.officeid
        );
        setData(response);
      }
      setLoading(false);
    };

    fetchData();
  }, [props.officeid]);

  return (
    <div>
      {loading && <div></div>}
      {!loading && (
        <Form.Item>
          <Image height={"600px"} width={"750px"} src={data}>
            <Spin />
          </Image>
        </Form.Item>
      )}
    </div>
  );
};
export default OfficeImage;
