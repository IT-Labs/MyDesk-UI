import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import { fetchOfficeImageApi } from "../../../services/office.service";
import { Image, Spin } from "antd";

const OfficeImage = (props) => {
  const [data, setData] = useState();
  const { matches } = window.matchMedia("(max-width: 820px)");

  const fetchOfficePlan = async (officeId) => {
    if (officeId) {
      const { data: response } = await fetchOfficeImageApi(officeId);
      setData(response);
    }
  };

  useEffect(() => {
    fetchOfficePlan(props.officeId);
  }, [props.officeId]);

  return (
    <div>
      {data ? (
        <Image
          src={data}
          alt="office image"
          style={{ height: "25rem", width: matches ? 350 : "100%" }}
        >
          <Spin />
        </Image>
      ) : (
        <div
          style={{
            height: "25rem",
            background: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <h2>No image available</h2>
        </div>
      )}
    </div>
  );
};
export default OfficeImage;
