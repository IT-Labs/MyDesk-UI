import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  Dropdown,
  Menu,
  Modal,
  Row,
  Select,
  Space,
  Tooltip,
  Alert,
} from "antd";
import OfficeBranchSelection from "../../components/inputs/OfficeBranchSelection/OfficeBranchSelection";
import CalendarImplementation from "../../components/inputs/Calendar/CalendarImplementation";
import OfficeImage from "../../components/inputs/OfficeImage/OfficeImage";
import CardsSection from "../../components/CardsComponent/CardsSection";
import styles from "./Homepage.module.scss";
import api from "../../helper/api";

import Input from "antd/lib/input/Input";
import InfiniteScroll from "react-infinite-scroll-component";

import { useDispatch, useSelector } from "react-redux";

import { fetchEmployees } from "../../utils/fetchEmployees";

import { setEnd, setStart } from "../../redux/Date/Date";
import { DownOutlined } from "@ant-design/icons";
import {
  openError,
  openNotification,
} from "../../components/notification/Notification";

import { getAvatar } from "../../redux/Avatar/Avatar";
import MainLayout from "../../layouts/MainLayout";

const Home = () => {
  const [officeid, setofficeid] = useState();
  const [selectedCard, setSelectedCard] = useState([]);
  const [startDateRes, setStartDate] = useState([]);
  const [endDateRes, setEndDate] = useState([]);
  const [refreshCards, setRefreshCards] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectValue, setSelectValue] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [dates, setDates] = useState([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [defCoWorkerValue, setDefCoWorkerValue] = useState("Select a CoWorker");
  const [selectedCategories, setSelectedCategories] = useState({});
  const [singleMonitor, setSingleMonitor] = useState(false);
  const [dualMonitor, setDualMonitor] = useState(false);
  const [nearWindow, setNearWindow] = useState(false);

  const [selectedCoworker, setSelectedCoworker] = useState({});
  const [showReserveForCoworker, setShowReserveForCoworker] = useState(false);
  const [invalidSearchInput, setInvalidSearchInput] = useState(false);
  const [forCoworker, setForCoworker] = useState(false);
  const [disableReserveBtn, setDisableReserveBtn] = useState(true);
  const dispatch = useDispatch();
  const { employees } = useSelector((state) => state.employees);
  const user = useSelector((state) => state.user.decodedUser);

  const closeModalFunction = () => {
    setIsModalVisible(false);
    setReviews([]);
  };

  function setDate(startDate, endDate, range) {
    setStartDate(startDate);
    setEndDate(endDate);
    setDates(range);
  }

  const clickSingleMonitor = () => {
    setSingleMonitor(!singleMonitor);
    setSelectedCategories({
      ...selectedCategories,
      singleMonitor: !singleMonitor,
    });
  };

  const clickDualMonitor = () => {
    setDualMonitor(!dualMonitor);
    setSelectedCategories({
      ...selectedCategories,
      doubleMonitor: !dualMonitor,
    });
  };

  const clickNearWindow = () => {
    setNearWindow(!nearWindow);
    setSelectedCategories({
      ...selectedCategories,
      nearWindow: !nearWindow,
    });
  };

  async function changeofficebranch(value) {
    setDefCoWorkerValue("Select a CoWorker");
    setofficeid(value);
    setForCoworker(false);
  }

  function onSelectCard(value, availability) {
    setSelectedCard(value);
    setIsAvailable(availability);
  }

  function refresh() {
    setRefreshCards({});
  }

  const showReviewsForSelectedCard = () => {
    setIsModalVisible(true);
    api
      .get(`entity/reviews/${selectedCard.id}`)
      .then(({ data }) => {
        if (data.length) {
          setReviews(data);
        } else {
          setReviews([{ reviews: "There were no available reviews" }]);
        }
      })
      .catch(() => {
        setReviews(["There were no available reviews"]);
      });
  };

  const getUsers = async () => {
    fetchEmployees(dispatch, user);
  };

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendReservation = (data) => {
    const config = {
      Authorization: `Bearer ${localStorage.getItem("msal.idtoken")}`,
    };
    api
      .post("employee/reserve/coworker", data, config)
      .then((response) => {
        refresh();
        setDates([]);
        setSelectedCard([]);
        setStartDate([]);
        setEndDate([]);
        openNotification("You have successfully reserved a desk.");
      })
      .catch((error) => {
        console.log(error.response);
        error.response.status === 401
          ? openError("Your session has expired, please login again.")
          : openError(error.response.data.ErrorMessage);
        setDates([]);
        setSelectedCard([]);
        setStartDate([]);
        setEndDate([]);
        setShowReserveForCoworker(false);
      });
  };

  const clearDate = () => {
    dispatch(setStart(null));
    dispatch(setEnd(null));
    setDates([]);
  };

  const makeReservation = () => {
    const data = {
      deskId: selectedCard.id,
      startDate: startDateRes,
      endDate: endDateRes,
      employeeEmail: user.preferred_username,
    };

    sendReservation(data);
  };

  const filterByAvailability = (e) => {
    setEmployeeSearch("");
    setSelectValue(e);
  };

  const reserveForCoworker = async () => {
    if (!selectedCoworker.email) {
      openError("Co-worker must be selected");
      setShowReserveForCoworker(false);
      return;
    }

    const data = {
      startDate: startDateRes,
      endDate: endDateRes,
      employeeEmail: selectedCoworker.email,
      deskId: selectedCard.id,
    };
    const config = {
      Authorization: `Bearer ${localStorage.getItem("msal.idtoken")}`,
    };
    api
      .post("employee/reserve/coworker", data, config)
      .then((response) => {
        refresh();
        setDates([]);
        setSelectedCard([]);
        setStartDate([]);
        setEndDate([]);
        openNotification("You have successfully reserved for your co-worker");
        setShowReserveForCoworker(false);
        setForCoworker(false);
      })
      .catch((error) => {
        console.log(error.response);
        error.response.status === 401
          ? openError("Your session has expired, please login again.")
          : openError(error.response.data.ErrorMessage);
        setDates([]);
        setSelectedCard([]);
        setStartDate([]);
        setEndDate([]);
        setShowReserveForCoworker(false);
      });
  };

  const checkTypeOfReservation = () => {
    if (Object.keys(selectedCoworker) === 0 && forCoworker) {
      openError("Please select your co-worker if you have the box checked");
      return;
    }
    if (forCoworker) {
      setShowReserveForCoworker(true);
    } else {
      makeReservation();
    }
  };

  const setCoworker = (val) => {
    if (val.length === 0) {
      setDefCoWorkerValue("Select a CoWorker");
      setSelectedCoworker({});
      return;
    }
    const foundEmployee = employees.find(
      (item) => `${item.firstName} ${item.surname} ${item.jobTitle}` === val
    );

    const name = val.split(" ");
    setDefCoWorkerValue(`${name[0]} ${name[1]}`);
    setSelectedCoworker(foundEmployee);
  };

  const getEmployeeSearch = (value) => {
    setInvalidSearchInput(value);
  };

  useEffect(() => {
    dispatch(getAvatar());
  }, []);

  useEffect(() => {
    setSelectedCoworker({});
    setDefCoWorkerValue("Select a CoWorker");
  }, [forCoworker]);

  useEffect(() => {}, [selectValue]);

  useEffect(() => {
    filterByAvailability(null);
    setSingleMonitor(false);
    setDualMonitor(false);
    setNearWindow(false);
    setSelectedCategories({});
  }, [dates]);

  useEffect(() => {
    const btnEnable =
      selectedCard.length === 0 ||
      !isAvailable ||
      dates.length === 0 ||
      (forCoworker && Object.keys(selectedCoworker).length === 0);

    setDisableReserveBtn(btnEnable);
  }, [dates, selectedCard, selectedCoworker, endDateRes, isAvailable]);

  return (
    <MainLayout isHome={true}>
      <Row className={`${styles.contentRow}`}>
        <Col span={12} xl={11} lg={11} md={22} sm={22} xs={22}>
          <Row gutter={[8, 8]} className={styles.leftInputRow}>
            <Col
              className={styles.officeInput}
              span={12}
              xl={12}
              lg={12}
              md={12}
              sm={12}
              xs={20}
            >
              <OfficeBranchSelection
                onOfficebranchChange={changeofficebranch}
                styles={styles.pStyles}
                dataCy="office-branch-select"
              />
            </Col>
            <Col
              className={styles.inputWidth}
              span={12}
              xl={12}
              lg={12}
              md={12}
              sm={12}
              xs={20}
            >
              <div>
                <p
                  className={styles.pStyles}
                  style={{ position: "relative", left: "19%" }}
                >
                  Select date
                </p>
                <CalendarImplementation
                  dateFunction={setDate}
                  onSelectCard={onSelectCard}
                  officeid={officeid}
                  startDate={startDateRes}
                  endDate={endDateRes}
                  dates={dates}
                  clearDate={clearDate}
                  isHome={true}
                />
              </div>
            </Col>
          </Row>

          <div className={`${styles.officeImgCol} ${styles.cardColColor}`}>
            <OfficeImage officeid={officeid} />
          </div>
        </Col>
        <Col span={12} xl={11} lg={11} md={22} sm={22} xs={22}>
          <Row between="xs" className={styles.rightInputRow} gutter={[8, 8]}>
            <Col
              className={styles.inputWidth}
              span={8}
              xl={8}
              lg={8}
              md={8}
              sm={8}
              xs={20}
            >
              <div>
                <p className={styles.pStyles}>Search by name</p>
                <Input
                  className={styles.inputSize}
                  data-cy="search-by-name"
                  value={employeeSearch}
                  onChange={(e) =>
                    setEmployeeSearch(e.target.value.replace(/\s+/, ""))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setEmployeeSearch("");
                    }
                  }}
                />
                {invalidSearchInput ? (
                  <Alert
                    message="There is no data or input is invalid."
                    data-cy="login-incorrect-credentials-message"
                    type="error"
                    className={`${styles.alert} ${styles.input}`}
                  />
                ) : null}
              </div>
            </Col>

            <Col
              className={styles.inputWidth}
              span={8}
              xl={8}
              lg={8}
              md={8}
              sm={8}
              xs={20}
            >
              <div>
                <p className={styles.pStyles}>Filter by availability</p>
                <Select
                  showSearch
                  data-cy="filter-by-availability"
                  className={styles.inputSize}
                  defaultValue={selectValue}
                  value={selectValue}
                  onChange={filterByAvailability}
                >
                  <Select.Option value={null} key={1}>
                    All
                  </Select.Option>
                  <Select.Option value={true} key={2}>
                    Available
                  </Select.Option>
                  <Select.Option value={false} key={3}>
                    Reserved
                  </Select.Option>
                </Select>
              </div>
            </Col>

            <Col
              className={styles.inputWidth}
              span={8}
              xl={8}
              lg={8}
              md={8}
              sm={8}
              xs={20}
            >
              <div>
                <p className={styles.pStyles}>Filter by category</p>
                <Dropdown
                  arrow={true}
                  overlay={
                    <Menu className={styles.menu} data-cy="filter-by-category">
                      <Tooltip
                        title={`${
                          dualMonitor
                            ? "Both options can not be selected at the same time."
                            : ""
                        }`}
                      >
                        <Menu.Item>
                          <Checkbox
                            checked={singleMonitor}
                            onClick={clickSingleMonitor}
                            disabled={dualMonitor}
                          >
                            Single monitor
                          </Checkbox>
                        </Menu.Item>
                      </Tooltip>

                      <Tooltip
                        title={`${
                          singleMonitor
                            ? "Both options can not be selected at the same time."
                            : ""
                        }`}
                      >
                        <Menu.Item>
                          <Checkbox
                            checked={dualMonitor}
                            onClick={clickDualMonitor}
                            disabled={singleMonitor}
                          >
                            Dual monitor
                          </Checkbox>
                        </Menu.Item>
                      </Tooltip>
                      <Menu.Item key="2">
                        <Checkbox
                          checked={nearWindow}
                          onClick={clickNearWindow}
                        >
                          Near window
                        </Checkbox>
                      </Menu.Item>
                    </Menu>
                  }
                  trigger={["click"]}
                >
                  <Button className={styles.inputSize}>
                    <Space
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      {singleMonitor && !nearWindow
                        ? "Single Monitor"
                        : dualMonitor && !nearWindow
                        ? "Dual Monitor"
                        : nearWindow && !singleMonitor && !dualMonitor
                        ? "Near Window"
                        : "All Categories"}
                      <DownOutlined
                        style={{
                          color: "rgba(0,0,0,0.25)",
                          fontSize: "12px",
                          float: "right",
                        }}
                      />
                    </Space>
                  </Button>
                </Dropdown>
              </div>
            </Col>
          </Row>

          <CardsSection
            refresh={refreshCards}
            selectedCard={onSelectCard}
            officeid={officeid}
            available={selectValue}
            employeeSearch={employeeSearch}
            categories={selectedCategories}
            getEmployeeSearch={getEmployeeSearch}
          />

          <Row className={styles.buttonsSection} gutter={[8, 8]}>
            <Col span={11} xl={11} lg={11} md={11} sm={11} xs={20}>
              <div className={styles.coWorkerSelect}>
                <Checkbox
                  data-cy="set-for-coworker-check"
                  onClick={() => setForCoworker(!forCoworker)}
                  checked={forCoworker}
                />
                <Select
                  value={defCoWorkerValue}
                  data-cy="coworker-select"
                  placement={"topRight"}
                  className={`${styles.inputSize} ${styles.reserveForCoworker}`}
                  showSearch
                  onChange={setCoworker}
                  disabled={!forCoworker}
                >
                  {employees &&
                    employees.map((item) => (
                      <Select.Option
                        key={item.id}
                        value={`${item.firstName} ${item.surname} ${item.jobTitle}`}
                        style={{ height: 50 }}
                      >
                        <h4
                          style={{ fontSize: 14, padding: 0, margin: 0 }}
                        >{`${item.firstName} ${item.surname}`}</h4>
                        <p style={{ fontSize: 12 }}>{item.jobTitle}</p>
                      </Select.Option>
                    ))}
                </Select>
              </div>
            </Col>

            <Col
              span={11}
              xl={11}
              lg={11}
              md={11}
              sm={11}
              xs={20}
              style={{ display: "flex" }}
            >
              <Button
                block
                data-cy="reserve-button"
                disabled={disableReserveBtn}
                onClick={() => checkTypeOfReservation()}
                className={`${styles.buttons} ${
                  forCoworker ? styles.orangeBtn : styles.tealBtn
                }`}
                size="large"
              >
                Reserve
              </Button>

              <Button
                block
                data-cy="show-reviews-button"
                disabled={selectedCard.length === 0 ? true : false}
                size="large"
                className={`${styles.buttons} ${styles.tealBtn}`}
                onClick={() => showReviewsForSelectedCard()}
              >
                Show reviews
              </Button>
            </Col>

            <Modal
              maskClosable={true}
              title="Reviews for selected entity"
              visible={isModalVisible}
              onOk={closeModalFunction}
              onCancel={closeModalFunction}
              cancelButtonProps={{ style: { display: "none" } }}
            >
              <InfiniteScroll className={styles.reviewModal} dataLength={3}>
                <ul>
                  {reviews &&
                    reviews.map(({ id, reviews }) =>
                      id ? <li key={id}>{reviews}</li> : <p>{reviews}</p>
                    )}
                </ul>
              </InfiniteScroll>
            </Modal>
            <Modal
              title="Reserve desk for co-worker"
              visible={showReserveForCoworker}
              onCancel={() => setShowReserveForCoworker(false)}
              onOk={() => reserveForCoworker()}
            >
              Are you sure you want to reserve this desk for{" "}
              {selectedCoworker.firstName} {selectedCoworker.surname}?
            </Modal>
          </Row>
        </Col>
      </Row>
    </MainLayout>
  );
};

export default Home;
