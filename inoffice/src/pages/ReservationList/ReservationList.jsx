import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import UserHeade from "../../components/Head/UserHead";
import {
  Button,
  Card,
  Input,
  Modal,
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
import Loading from "../../components/Loading/Loading";

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [filterInput, setFilterInput] = useState("");
  const [initRes, setInitRes] = useState([]);
  const [visible, setVisible] = useState(false);
  const [toBeCancelled, setToBeCancelled] = useState(null);
  const sortResStruct = (res) => {
    const results = res
      .map((item) => {
        const start = new Date(item.startDate);
        const end = new Date(item.endDate);
        return {
          ...item,
          employee: `${item.employee.firstName} ${item.employee.lastName}`,
          office: item.officeName ? item.officeName : "Undefined office",
          entity: item.indexForOffice
            ? `Desk [${item.indexForOffice}]`
            : "Undefined Desk",
          key: item.id,
          startDate: Date.parse(item.startDate),
          endDate: Date.parse(item.endDate),
          date: `${moment(start).format("DD/MM/YYYY")}-${moment(end).format(
            "DD/MM/YYYY"
          )}`,
        };
      })
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
          moment(item.startDate).isAfter(moment()) &&
          moment(item.endDate).isAfter(moment())
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
          moment(item.startDate).isBefore(moment()) &&
          moment(item.endDate).isBefore(moment())
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
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
    api
      .get("admin/offices")
      .then(({ data }) => {
        let sorted = data.sort((a, b) => {
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
      render: (text, data, index) => {
        return (
          <Button
            className={styles.cancelBtn}
            onClick={() => {
              setToBeCancelled(data.id);
              setVisible(true);
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
          description: "You have successfully canceled a reservation",
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
                  <Tooltip title="Enter the First or the Last name of the user you want to search">
                    <Input
                      onChange={(e) => setFilterInput(e.target.value)}
                      className={styles.searchInput}
                      placeholder="Search by name"
                    />
                  </Tooltip>
                </div>
              </div>
              {reservations.length > 0 ? (
                <Table
                  columns={tabKey === "past" ? pastColumns : futureColumns}
                  dataSource={reservations.filter(
                    ({ office, employee }) =>
                      office.includes(filterVal) &&
                      employee.toLowerCase().includes(filterInput.toLowerCase())
                  )}
                  pagination={{ pageSize: 5, position: ["topCenter"] }}
                ></Table>
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 444,
                  }}
                >
                  <Loading />
                </div>
              )}
              <Modal
                maskClosable={false}
                title="Cancel user's reservation?"
                centered
                visible={visible}
                onOk={() => {
                  cancelReservation(toBeCancelled);
                  setToBeCancelled(null);
                  setVisible(false);
                }}
                onCancel={() => setVisible(false)}
              >
                <p>Do you really want to cancel this user’s reservation?</p>
              </Modal>
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
