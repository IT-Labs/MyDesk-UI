import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import UserHeade from "../../components/Head/UserHead";
import { Button, Card, Input, notification, Select, Table } from "antd";
import api from "../../helper/api";
import styles from "./ReservationList.module.css";
import { Excel } from "antd-table-saveas-excel";

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [filterInput, setFilterInput] = useState("");
  const [initRes, setInitRes] = useState([]);

  const sortResStruct = (res) => {
    const results = res
      .map(
        ({ employee, officeName, indexForOffice, startDate, endDate, id }) => {
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
            endDate: Date.parse(endDate),
            date: `${start.getDate()}/${
              start.getMonth() + 1
            }/${start.getFullYear()}-${end.getDate()}/${end.getMonth()}/${end.getFullYear()}`,
          };
        }
      )
      .sort((a, b) => {
        const date1 = new Date(a.startDate).getTime();
        const date2 = new Date(b.startDate).getTime();

        return date1 > date2 ? -1 : date1 < date2 ? 1 : 0;
      });
    setInitRes([...results]);
    sortFuture(results);
  };
  const [offices, setOffices] = useState([]);

  const sortFuture = (res) => {
    const future = res.filter(
      (item) =>
        item.startDate >= new Date().getTime() ||
        item.endDate >= new Date().getTime()
    );

    setReservations(future);
  };

  const sortPast = (res) => {
    const past = res.filter(
      (item) =>
        item.startDate < new Date().getTime() ||
        item.endDate < new Date().getTime()
    );

    setReservations(past);
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
    api
      .get("admin/offices")
      .then(({ data }) => {
        setOffices(data);
        console.log(data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAllRes();
  }, []);

  const futureColumns = [
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
        compare: (a, b) => {
          const date1 = new Date(a.startDate).getTime();
          const date2 = new Date(b.startDate).getTime();

          return date1 < date2 ? -1 : date1 > date2 ? 1 : 0;
        },
        multiple: 1,
      },
      sortDirections: ["ascend"],
    },
    {
      title: "Cancel",
      dataIndex: "cancel",
      key: 4,
      render: (text, record, index) => {
        return (
          <Button
            className={styles.cancelBtn}
            onClick={() => {
              cancelReservation(record.key);
            }}
          >
            Cancel
          </Button>
        );
      },
    },
  ];

  const pastColumns = [
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
        compare: (a, b) => {
          const date1 = new Date(a.startDate).getTime();
          const date2 = new Date(b.startDate).getTime();

          return date1 < date2 ? -1 : date1 > date2 ? 1 : 0;
        },
        multiple: 1,
      },
      sortDirections: ["ascend"],
    },
  ];
  const [filterVal, setFilterVal] = useState("");

  const tabList = [
    {
      key: "future",
      tab: "Future",
    },
    {
      key: "past",
      tab: "Past",
    },
  ];

  const [tabKey, setTabKey] = useState("");

  const cancelReservation = async (id) => {
    await api
      .delete("employee/reserve/" + id)
      .then((response) => {
        notification.open({
          message: "Notification",
          description: "You successfully canceled a reservation",
          placement: "top",
          duration: 4,
        });
        const filteredRes = initRes.filter((item) => item.key !== id);

        setInitRes(filteredRes);
        sortFuture(filteredRes);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Layout>
      <UserHeade />
      <Layout>
        <Sidebar selected="4" />
        <Content className={styles.content}>
          <div style={{ width: "80%" }}>
            <Card
              title={<Title reservations={initRes} columns={pastColumns} />}
              className={styles.resList}
              tabList={tabList}
              onTabChange={(key) => {
                setTabKey(key);
                if (key === "past") {
                  sortPast(initRes);
                } else {
                  sortFuture(initRes);
                }
              }}
            >
              <div className={styles.inputs}>
                <Select
                  defaultValue="All"
                  onChange={(val) => setFilterVal(val)}
                  style={{ width: 200 }}
                >
                  <Select.Option key={0} value="">
                    All
                  </Select.Option>
                  {offices.map(({ name, id }) => (
                    <Select.Option key={id} value={name}>
                      {name}
                    </Select.Option>
                  ))}
                </Select>
                <Input
                  onChange={(e) => setFilterInput(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              <Table
                columns={tabKey === "past" ? pastColumns : futureColumns}
                dataSource={reservations.filter(
                  ({ office, employee }) =>
                    office.includes(filterVal) &&
                    employee.toLowerCase().includes(filterInput.toLowerCase())
                )}
                pagination={{ pageSize: 5 }}
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
