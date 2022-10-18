import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import UserHeade from "../../components/Head/UserHead";
import {
  Button,
  Card,
  Input,
  Modal,
  Select,
  Table,
  Tooltip,
  Row,
  Col,
  Alert,
} from "antd";
import api from "../../helper/api";
import styles from "./ReservationList.module.scss";
import { FileSearchOutlined, SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import Loading from "../../components/Loading/Loading";
import Title from "./Title";
import { getAllFutureReservations } from "../../utils/getAllFutureReservations";
import { getAllPastReservations } from "../../utils/getAllPastReservations";
import {
  openError,
  openNotification,
} from "../../components/notification/Notification";

import placeholderAvatar from "../../assets/avatar.png";

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [filterInput, setFilterInput] = useState("");
  const [excelSheet, setExcelSheet] = useState("Future Reservation List");
  const [initRes, setInitRes] = useState([]);
  const [visible, setVisible] = useState(false);
  const [filterOffice, setFilterOffice] = useState("");
  const [invalidSearchInput, setInvalidSearchInput] = useState(false);

  const [toBeCancelled, setToBeCancelled] = useState(null);

  const getImage = async (mail) => {
    const tmp = await fetch(
      `https://graph.microsoft.com/v1.0/users/${mail}/photo/$value`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        responseType: "blob",
      }
    );
    const response = await tmp.blob();

    if (response) {
      return URL.createObjectURL(response);
    } else {
      return null;
    }
  };

  const newInfo = async (item, image) => {
    const start = new Date(item.startDate);
    const end = new Date(item.endDate);

    return {
      ...item,
      avatar: image,
      employee: `${item.employee.firstName} ${item.employee.lastName}`,
      office: item.officeName ? item.officeName : "Undefined office",
      entity: item.desk.indexForOffice
        ? `Desk [${item.desk.indexForOffice}]`
        : "Undefined Desk",
      key: item.id,
      startDate: Date.parse(start),
      endDate: Date.parse(end),
      date: `${moment(start).format("DD/MM/YYYY")}-${moment(end).format(
        "DD/MM/YYYY"
      )}`,
      email: item.employee.email,
      ...item.employee,
    };
  };

  const sortResStruct = async (res) => {
    const results = await Promise.all(
      res.map(async (item, id) => {
        const image = await getImage(item.employee.email);
        const info = await newInfo(item, image).then((res) => {
          return res;
        });

        return info;
      })
    );

    setInitRes(results);
    sortFuture(results);

    return;
  };
  const [offices, setOffices] = useState([]);

  const sortFuture = (res) => {
    const future = getAllFutureReservations(res);

    setReservations(future);
  };

  const sortPast = (res) => {
    const past = getAllPastReservations(res);

    setReservations(past);
  };

  const getAllRes = () => {
    api
      .get("employee/reservations/all")
      .then(({ data }) => {
        sortResStruct(data.values);
      })
      .catch((err) => {
        console.log(err);
      });
    api.get("admin/offices").then(({ data }) => {
      let sorted = data.sort((a, b) => {
        return a.name < b.name ? -1 : 1;
      });
      setOffices(sorted);
    });
    // .catch((err) => console.log(err));
  };

  const filterReservation = () => {
    const filteredReservations = reservations.filter((reservation) =>
      reservation.employee.toLowerCase().includes(filterInput.toLowerCase())
    );
    filteredReservations.length
      ? setInvalidSearchInput(false)
      : setInvalidSearchInput(true);
  };

  useEffect(() => {
    filterReservation();
  }, [filterInput]);

  useEffect(() => {
    getAllRes();
  }, []);

  const futureColumns = [
    {
      title: "Employee",
      dataIndex: "employee",
      key: 1,
      width: "40px",
      render: (text, record, index) => {
        return (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
            }}
          >
            <img
              src={record.avatar}
              alt=""
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = placeholderAvatar;
              }}
              className={styles.avatar}
            />
            <span style={{ marginLeft: "15px" }}>{record.employee}</span>
          </div>
        );
      },
    },
    {
      title: "Office",
      dataIndex: ["desk", "office", "name"],
      key: 2,
      width: "25px",
    },
    { title: "Entity", dataIndex: "entity", key: 3, width: "10px" },
    {
      title: "Date",
      dataIndex: "date",
      key: 3,
      width: "40px",
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
      width: "10px",
      key: 4,
      render: (text, data, index) => {
        return (
          <Button
            className={styles.cancelBtn}
            onClick={() => {
              setToBeCancelled(data.key);
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
      width: "30%",
      render: (text, record, index) => {
        return (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
            }}
          >
            <img
              src={record.avatar ? record.avatar : placeholderAvatar}
              alt=""
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = placeholderAvatar;
              }}
              className={styles.avatar}
            />
            <span style={{ marginLeft: "15px" }}>{record.employee}</span>
          </div>
        );
      },
    },
    { title: "Office", dataIndex: ["desk", "office", "name"], key: 2 },
    { title: "Entity", dataIndex: "entity", key: 3 },
    {
      title: "Date",
      dataIndex: "date",
      key: 4,
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
        openNotification("You have successfully canceled the reservation");
        const filteredRes = initRes.filter((item) => item.key !== id);
        setInitRes(filteredRes);
        sortFuture(filteredRes);
      })
      .catch((error) => {
        console.error(error);
        openError(
          "An error occurred while canceling the reservation, please try again"
        );
      });
  };

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();

        setFilterInput("");
      }
    };
    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  const columnsForExcel = pastColumns.map(({ title, dataIndex, key }) => ({
    title,
    dataIndex,
    key,
  }));

  return (
    <>
      <Layout>
        <UserHeade />
        <Layout>
          <Sidebar selected="4" />
          <Content className={styles.content}>
            <div style={{ width: "80%" }}>
              <Card
                title={
                  <Title
                    reservations={reservations}
                    columns={columnsForExcel}
                    sheet={excelSheet}
                  />
                }
                className={styles.resList}
                tabList={tabList}
                onTabChange={(key) => {
                  setTabKey(key);
                  if (key === "past") {
                    sortPast(initRes);
                    setExcelSheet("Past Reservation List");
                  } else {
                    sortFuture(initRes);
                    setExcelSheet("Future Reservation List");
                  }
                }}
              >
                <div className={styles.inputs}>
                  <div>
                    <SearchOutlined style={{ margin: 10 }} />
                    <Tooltip title="Select which office you want to filter by">
                      <Select
                        showSearch
                        data-cy="office-branch-select"
                        defaultValue="Select office"
                        onChange={(officeName) => setFilterOffice(officeName)}
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
                        value={filterInput}
                        onChange={(e) =>
                          setFilterInput(e.target.value.replace(/\s+/, ""))
                        }
                        className={styles.searchInput}
                        onPress
                        placeholder="Search by name"
                        style={{ width: 200 }}
                      />
                      {invalidSearchInput ? (
                        <Alert
                          message="There is no data or input is invalid."
                          data-cy="login-incorrect-credentials-message"
                          type="error"
                          className={`${styles.alert} ${styles.input}`}
                        />
                      ) : null}
                    </Tooltip>
                  </div>
                </div>
                {reservations.length > 0 ? (
                  <Table
                    columns={tabKey === "past" ? pastColumns : futureColumns}
                    dataSource={reservations.filter(
                      (reservation) =>
                        reservation.desk.office.name.includes(filterOffice) &&
                        reservation.employee
                          .toLowerCase()
                          .includes(filterInput.toLowerCase())
                    )}
                    pagination={{ pageSize: 4, position: ["bottomRight"] }}
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 444,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        height: 200,
                      }}
                    >
                      <Loading />
                      <p>Loading, please wait</p>
                    </div>
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
                  <p>Do you really want to cancel this reservation?</p>
                </Modal>
              </Card>
            </div>
          </Content>
        </Layout>
      </Layout>
      <Row className={styles.footerSection} align="center">
        <Col align="center" span={24}>
          <p className={styles.footerText}>
            inOffice ©2022 Created by inOfficeTeam
          </p>
        </Col>
      </Row>
    </>
  );
};

export default ReservationList;
