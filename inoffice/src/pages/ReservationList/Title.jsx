import React from "react";
import { Excel } from "antd-table-saveas-excel";
import { Button } from "antd";
import styles from "./ReservationList.module.scss";

const Title = ({ reservations, columns, sheet, ifNoData }) => {
  const handleClick = () => {
    const excel = new Excel();
    excel
      .addSheet(sheet)
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
        className={ifNoData ? null : styles.cancelBtn}
        style={{ width: 120, height: 40 }}
        disabled={ifNoData}
        onClick={handleClick}
      >
        Export Data
      </Button>
    </div>
  );
};

export default Title;
