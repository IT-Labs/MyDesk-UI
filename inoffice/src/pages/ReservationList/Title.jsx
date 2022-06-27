import React from "react";
import { Excel } from "antd-table-saveas-excel";
import { Button } from "antd";
import styles from "./ReservationList.module.scss";

const Title = ({ reservations, columns }) => {
  const handleClick = () => {
    const excel = new Excel();
    excel
      .addSheet("test")
      .addColumns(columns)
      .addDataSource(reservations, {
        str2Percent: true,
      })
      .saveAs("Excel.xlsx");
  };
  return (
    <div className={styles.title}>
      <p style={{ fontSize: "1.125rem" }}>Reservation list</p>
      <Button
        className={styles.cancelBtn}
        style={{ width: 120, height: 40 }}
        onClick={handleClick}
      >
        Export Data
      </Button>
    </div>
  );
};

export default Title;
