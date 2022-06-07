import React from "react";
import "antd/dist/antd.css";
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
        console.log(response);
      }
      setLoading(false);
    };

    fetchData();
  }, [props.officeid]);

  return (
    <div>
      {data ? (
        <Image src={data} alt="office image" style={{ height: 400 }}>
          <Spin />
        </Image>
      ) : (
        <div
          style={{
            height: 400,
            background: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2>No image available</h2>
        </div>
      )}
    </div>
  );
};
export default OfficeImage;
