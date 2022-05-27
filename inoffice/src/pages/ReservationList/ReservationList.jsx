import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import UserHeade from "../../components/Head/UserHead";
import {
  Button,
  Card,
  Input,
  notification,
  Select,
  Table,
  Tooltip,
} from "antd";
import api from "../../helper/api";
import styles from "./ReservationList.module.css";
import { Excel } from "antd-table-saveas-excel";
import { FileSearchOutlined, SearchOutlined } from "@ant-design/icons";
import moment from "moment";

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
            date: `${moment(start).format("DD/MM/YYYY")}-${moment(end).format(
              "DD/MM/YYYY"
            )}`,
          };
        }
      )
      .sort((a, b) => {
        const date1 = new Date(a.startDate).getTime();
        const date2 = new Date(b.startDate).getTime();

        return date1 < date2 ? -1 : date1 > date2 ? 1 : 0;
      });
    setInitRes([...results]);
    sortFuture(results);
  };
  const [offices, setOffices] = useState([]);

  const sortFuture = (res) => {
    const future = res
      .filter(
        (item) =>
          item.startDate >= new Date().getTime() ||
          item.endDate >= new Date().getTime()
      )
      .sort((a, b) => {
        const date1 = new Date(a.startDate).getTime();
        const date2 = new Date(b.startDate).getTime();

        return date1 < date2 ? -1 : date1 > date2 ? 1 : 0;
      });

    setReservations(future);
  };

  const sortPast = (res) => {
    const past = res
      .filter(
        (item) =>
          item.startDate < new Date().getTime() ||
          item.endDate < new Date().getTime()
      )
      .sort((a, b) => {
        const date1 = new Date(a.startDate).getTime();
        const date2 = new Date(b.startDate).getTime();

        return date1 > date2 ? -1 : date1 < date2 ? 1 : 0;
      });

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
        const sorted = data.sort((a, b) => {
          return a.name < b.name ? -1 : b.name > a.name ? 1 : 0;
        });
        setOffices(sorted);
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
      sortDirections: ["descend"],
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
                <div>
                  <SearchOutlined style={{ margin: 10 }} />
                  <Tooltip title="Select which office you want to filter by">
                    <Select
                      showSearch
                      defaultValue="Select office"
                      onChange={(val) => setFilterVal(val)}
                      style={{ width: 200 }}
                    >
                      <Select.Option key={0} value="">
                        All offices
                      </Select.Option>
                      {offices.map(({ name, id }) => (
                        <Select.Option key={id} value={name}>
                          {name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Tooltip>
                </div>
                <div>
                  <FileSearchOutlined style={{ margin: 10 }} />
                  <Tooltip title="Searches for a specific user's reservations">
                    <Input
                      onChange={(e) => setFilterInput(e.target.value)}
                      className={styles.searchInput}
                      placeholder="Search username"
                    />
                  </Tooltip>
                </div>
              </div>
              <Table
                columns={tabKey === "past" ? pastColumns : futureColumns}
                dataSource={reservations.filter(
                  ({ office, employee }) =>
                    office.includes(filterVal) &&
                    employee.toLowerCase().includes(filterInput.toLowerCase())
                )}
                pagination={{ pageSize: 5, position: ["topCenter"] }}
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
      <p>Reservation list</p>
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

export default ReservationList;
