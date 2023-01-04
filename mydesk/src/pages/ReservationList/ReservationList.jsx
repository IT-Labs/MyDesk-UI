import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import {
  Button,
  Card,
  Input,
  Modal,
  Select,
  Table,
  Tooltip,
  Alert,
} from "antd";
import styles from "./ReservationList.module.scss";
import {
  FileSearchOutlined,
  SearchOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import moment from "moment";
import Loading from "../../components/Loading/Loading";
import Title from "./Title";
import { openNotification } from "../../components/notification/Notification";
import placeholderAvatar from "../../assets/avatar.png";
import {
  getAllFutureReservationsApi,
  getAllPastReservationsApi,
  cancelReservationApi,
} from "../../services/reservation.service";
import { fetchAllOfficesAdminApi } from "../../services/office.service";
import { getImageApi } from "../../services/getImageApi";
import MainLayout from "../../layouts/MainLayout";
import { sortByName } from "../../utils/sortByName";
import { useSelector } from "react-redux";

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [allFutureReservations, setAllFutureReservations] = useState([]);
  const [allPastReservations, setAllPastReservations] = useState([]);
  const [exportReservations, setExportReservations] = useState([]);
  const [ifNoData, setIfNoData] = useState(false);
  const [filterInput, setFilterInput] = useState("");
  const [excelSheet, setExcelSheet] = useState("Future Reservation List");
  const [initRes, setInitRes] = useState([]);
  const [visible, setVisible] = useState(false);
  const [filterOffice, setFilterOffice] = useState("");
  const [invalidSearchInput, setInvalidSearchInput] = useState(false);
  const [offices, setOffices] = useState([]);
  const [tabKey, setTabKey] = useState("");
  const [toBeCancelled, setToBeCancelled] = useState(null);
  const [loadingTableData, setLoadingTableData] = useState(false);
  const [loadingAllReservations, setLoadingAllReservations] = useState(true);
  const [loadingAllFutureReservations, setLoadingAllFutureReservations] =
    useState(false);
  const [loadingAllPastReservations, setLoadingAllPastReservations] =
    useState(false);
  const [skipPage, setSkipPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const media = window.matchMedia("(max-width: 820px)");
  const loggedUser = useSelector((state) => state.user.loggedUser);
  const { employees } = useSelector((state) => state.employees);

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
            {!media.matches && (
              <img
                src={record.avatar ?? placeholderAvatar}
                alt="user avatar"
                className={styles.avatar}
              />
            )}
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
      key: 4,
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
      width: "5px",
      key: 5,
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

  const columnsForExcel = pastColumns.map(({ title, dataIndex, key }) => ({
    title,
    dataIndex,
    key,
  }));

  const newUserInfo = async (item, image) => {
    const start = new Date(item.startDate);
    const end = new Date(item.endDate);

    return {
      ...item,
      avatar: image,
      employee: `${item.employee.firstName} ${item.employee.surname}`,
      isSSOAccount: item.employee.isSSOAccount,
      office: item.desk.office.name
        ? item.desk.office.name
        : "Undefined office",
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
    };
  };

  const sortResStruct = async (res, isAllFuture) => {
    const results = await Promise.all(
      res.map(async (item) => {
        const info = await newUserInfo(item, null).then((res) => {
          return res;
        });

        return info;
      })
    );

    if (isAllFuture === null) {
      setLoadingTableData(false);
      setReservations(results);
      getImagesForReservations(results, null);
    } else if (isAllFuture) {
      setAllFutureReservations(results);
      getImagesForReservations(results, true);
    } else {
      setAllPastReservations(results);
      getImagesForReservations(results, false);
    }

    return;
  };

  const getImagesForReservations = async (reservations, isAllFuture) => {
    const loggedEmployee = employees.find(
      (employee) => employee.email === loggedUser.preferred_username
    );

    if (loggedEmployee && loggedEmployee.isSSOAccount) {
      reservations = await Promise.all(
        reservations.map(async (reservation) => {
          if (
            reservation.isSSOAccount &&
            !reservation.email.includes("gmail.com")
          ) {
            const image = await getImage(reservation.email);
            return await addImage(reservation, image).then((res) => {
              return res;
            });
          }

          return reservation;
        })
      );
    }

    if (isAllFuture === null) {
      setInitRes(reservations);
      setReservations(reservations);
    } else if (isAllFuture) {
      setAllFutureReservations(reservations);
      setLoadingAllFutureReservations(true);
    } else {
      setAllPastReservations(reservations);
      setLoadingAllPastReservations(true);
    }
  };

  const getImage = async (mail) => {
    const tmp = await getImageApi(mail);
    const response = await tmp.blob();

    if (response) {
      return URL.createObjectURL(response);
    } else {
      return null;
    }
  };

  const addImage = async (item, image) => {
    return {
      ...item,
      avatar: image,
    };
  };

  const getAllOffices = () => {
    fetchAllOfficesAdminApi().then(({ data }) => {
      let sorted = sortByName(data);
      setOffices(sorted);
    });
    getFutureReservations(0);
  };

  const getFutureReservations = (skip) => {
    setLoadingTableData(true);
    getAllFutureReservationsApi(skip).then(({ data }) => {
      setTotalCount(data.totalCount);
      sortResStruct(data.values, null);
    });
  };

  const getAllFutureReservations = () => {
    getAllFutureReservationsApi().then(({ data }) => {
      sortResStruct(data.values, true);
    });
  };

  const getPastReservations = (skip) => {
    setLoadingTableData(true);
    getAllPastReservationsApi(skip).then(({ data }) => {
      setTotalCount(data.totalCount);
      sortResStruct(data.values, null);
    });
  };

  const getAllPastReservations = () => {
    getAllPastReservationsApi().then(({ data }) => {
      sortResStruct(data.values, false);
    });
  };

  const filterReservationByName = () => {
    let allSelectedReservations;
    let filteredReservations;
    setCurrentPage(1);

    if (!filterInput.length && !filterOffice.length) {
      setInvalidSearchInput(false);
      tabKey === "past" ? getPastReservations(0) : getFutureReservations(0);
      onExportReservation([]);
      setIfNoData(false);
      return;
    }

    setLoadingTableData(true);

    if (tabKey === "past") {
      allSelectedReservations = allPastReservations;
    } else {
      allSelectedReservations = allFutureReservations;
    }

    if (!filterOffice.length) {
      filteredReservations = allSelectedReservations.filter((reservation) =>
        reservation.employee.toLowerCase().includes(filterInput.toLowerCase())
      );
    } else {
      filteredReservations = allSelectedReservations.filter(
        (reservation) =>
          reservation.office.includes(filterOffice) &&
          reservation.employee.toLowerCase().includes(filterInput.toLowerCase())
      );
    }

    if (filteredReservations.length) {
      setCurrentPage(1);
      setTotalCount(filteredReservations.length);
      setReservations(filteredReservations);
      onExportReservation(filteredReservations);
      setLoadingTableData(false);
      setInvalidSearchInput(false);
      setIfNoData(false);
    } else {
      setReservations(filteredReservations);
      setCurrentPage(1);
      setTotalCount(1);
      setLoadingTableData(false);
      setInvalidSearchInput(true);
      setIfNoData(true);
    }
  };

  const filterReservationByOffice = () => {
    let allSelectedReservations;
    let filteredReservations;
    setCurrentPage(1);

    if (!filterInput.length && !filterOffice.length) {
      tabKey === "past" ? getPastReservations(0) : getFutureReservations(0);
      onExportReservation([]);
      setIfNoData(false);
      return;
    }

    setLoadingTableData(true);

    if (tabKey === "past") {
      allSelectedReservations = allPastReservations;
    } else {
      allSelectedReservations = allFutureReservations;
    }

    if (!filterInput.length) {
      filteredReservations = allSelectedReservations.filter((reservation) =>
        reservation.office.includes(filterOffice)
      );
    } else {
      filteredReservations = allSelectedReservations.filter(
        (reservation) =>
          reservation.office.includes(filterOffice) &&
          reservation.employee.toLowerCase().includes(filterInput.toLowerCase())
      );
    }

    if (filteredReservations.length) {
      setCurrentPage(1);
      setTotalCount(filteredReservations.length);
      setReservations(filteredReservations);
      onExportReservation(filteredReservations);
      setLoadingTableData(false);
      setIfNoData(false);
    } else {
      setReservations(filteredReservations);
      setIfNoData(true);
      setCurrentPage(1);
      setTotalCount(1);
      setLoadingTableData(false);
    }
  };

  const onPageChanged = (pageNumber) => {
    const currentPage = pageNumber.current;
    setCurrentPage(currentPage);

    if (filterOffice.length || filterInput.length) {
      return;
    }

    let skipPages = 0;
    if (tabKey === "past") {
      skipPages = (currentPage - 1) * 4;
      getPastReservations(skipPages);
    } else {
      skipPages = (currentPage - 1) * 4;
      setSkipPage(skipPages);
      getFutureReservations(skipPages);
    }
  };

  const onExportReservation = (reservationsData) => {
    if (reservationsData.length) {
      setExportReservations(reservationsData);
    } else {
      if (tabKey === "past") {
        setExportReservations(allPastReservations);
      } else {
        setExportReservations(allFutureReservations);
      }
    }
  };

  const cancelReservation = async (id) => {
    await cancelReservationApi(id).then((response) => {
      openNotification("You have successfully cancelled the reservation");
      const filteredRes = initRes.filter((item) => item.key !== id);
      setInitRes(filteredRes);
      getFutureReservations(skipPage);
    });
  };

  useEffect(() => {
    getAllOffices();
    getAllFutureReservations();
    getAllPastReservations();
  }, []);

  useEffect(() => {
    onExportReservation([]);
  }, [allFutureReservations, tabKey]);

  useEffect(() => {
    filterReservationByName();
  }, [filterInput]);

  useEffect(() => {
    filterReservationByOffice();
  }, [filterOffice]);

  useEffect(() => {
    if (loadingAllFutureReservations && loadingAllPastReservations) {
      setLoadingAllReservations(false);
    }
  }, [loadingAllFutureReservations, loadingAllPastReservations]);

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

  return (
    <Layout>
      <div>{!media.matches && <Sidebar selected="4" />}</div>
      <MainLayout isHome={false}>
        <Content className={styles.content}>
          <div className={styles.contentWrapper}>
            <Card
              title={
                <Title
                  reservations={exportReservations}
                  columns={columnsForExcel}
                  sheet={excelSheet}
                  ifNoData={ifNoData}
                />
              }
              className={styles.resList}
              tabList={tabList}
              onTabChange={(key) => {
                setTabKey(key);
                if (key === "past") {
                  setFilterOffice("");
                  setFilterInput("");
                  setTotalCount(0);
                  setCurrentPage(1);
                  getPastReservations(0);
                  setExcelSheet("Past Reservation List");
                } else {
                  setFilterOffice("");
                  setFilterInput("");
                  setTotalCount(0);
                  setCurrentPage(1);
                  getFutureReservations(0);
                  setExcelSheet("Future Reservation List");
                }
              }}
            >
              <div className={styles.inputs}>
                <div className={styles.filterInputs}>
                  <SearchOutlined
                    className={styles.hideIcon}
                    style={{ margin: 10 }}
                  />
                  <Tooltip title="Select which office you want to filter by">
                    <Select
                      showSearch
                      className={styles.searchInput}
                      data-cy="office-branch-select"
                      defaultValue="Select office"
                      value={filterOffice}
                      onChange={(officeName) => setFilterOffice(officeName)}
                      loading={loadingAllReservations}
                      disabled={loadingAllReservations}
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
                <div className={styles.filterInputs}>
                  <FileSearchOutlined
                    className={styles.inputIcon}
                    style={{ margin: 10 }}
                  />
                  <Tooltip title="Enter the First or the Last name of the user you want to search">
                    <Input
                      className={styles.searchInput}
                      placeholder="Search by name"
                      data-cy="search-by-name-input"
                      disabled={loadingAllReservations}
                      prefix={
                        loadingAllReservations ? <LoadingOutlined /> : null
                      }
                      value={filterInput}
                      onChange={(e) =>
                        setFilterInput(e.target.value.replace(/\s+/, ""))
                      }
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

              <Table
                style={{ overflow: "auto", overflowY: "hidden" }}
                columns={tabKey === "past" ? pastColumns : futureColumns}
                dataSource={reservations}
                pagination={{
                  pageSize: 4,
                  total: totalCount,
                  current: currentPage,
                  position: ["bottomRight"],
                  showSizeChanger: false,
                  size: "small",
                }}
                loading={{
                  spinning: loadingTableData,
                  indicator: <Loading />,
                }}
                onChange={onPageChanged}
              />

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
      </MainLayout>
    </Layout>
  );
};

export default ReservationList;
