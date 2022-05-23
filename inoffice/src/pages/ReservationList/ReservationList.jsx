import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import UserHeade from "../../components/Head/UserHead";
import { Button, Card, Table } from "antd";
import api from "../../helper/api";
import styles from "./ReservationList.module.css";
import { Excel } from "antd-table-saveas-excel";
import { moment } from "moment";

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);

  const sortResStruct = (res) => {
    console.log(res);
    const results = res.map(
      (
        {
          employee,
          officeName,
          indexForOffice,
          conferenceRoom,
          startDate,
          endDate,
        },
        id
      ) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return {
          employee: `${employee.firstName} ${employee.lastName}`,
          office: officeName ? officeName : "Undefined office",
          entity: indexForOffice
            ? `Desk [${indexForOffice}]`
            : "Undefined Desk",
          key: id,
          startDate: Date.parse(startDate),
          date: `${start.getDate()}/${start.getMonth()}/${start.getFullYear()}-${end.getDate()}/${end.getMonth()}/${end.getFullYear()}`,
        };
      }
    );
    setReservations(results);
  };

  const getAllRes = () => {
    api
      .get("employee/reservations/all")
      .then(({ data }) => {
        sortResStruct(data.reservations);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAllRes();
  }, []);

  const columns = [
    {
      title: "Employee",
      dataIndex: "employee",
      key: 1,
    },
    { title: "Office", dataIndex: "office", key: 2 },
    { title: "Entity", dataIndex: "entity", key: 3 },
    {
      title: "Date",
      dataIndex: "date",
      key: 3,
      sorter: {
        compare: (a, b) => a.startDate - b.startDate,
        multiple: 1,
      },
    },
  ];
  return (
    <Layout>
      <UserHeade />
      <Layout>
        <Sidebar selected="4" />
        <Content className={styles.content}>
          <div style={{ width: "80%" }}>
            <Card
              title={<Title reservations={reservations} columns={columns} />}
              className={styles.resList}
            >
              <Table
                columns={columns}
                dataSource={reservations}
                pagination={{ pageSize: 5 }}
                className={styles.table}
              ></Table>
            </Card>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

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
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div className="ant-card-head-title">Reservation List</div>
      <Button
        style={{
          border: "1px solid teal",
          borderRadius: 7,
          width: 120,
          height: 40,
          color: "teal",
        }}
        onClick={handleClick}
      >
        Export Data
      </Button>
    </div>
  );
};

export default ReservationList;
