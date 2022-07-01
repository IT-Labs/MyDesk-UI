import React, { useEffect } from "react";
import UserHead from "../../components/Head/UserHead";
import Layout, { Content } from "antd/lib/layout/layout";
import {
  Button,
  Row,
  Col,
  Modal,
  Select,
  Checkbox,
  Menu,
  Dropdown,
  Space,
} from "antd";
import OfficeBranchSelection from "../../components/inputs/OfficeBranchSelection/OfficeBranchSelection";
import CalendarImplementation from "../../components/inputs/Calendar/CalendarImplementation";
import OfficeImage from "../../components/inputs/OfficeImage/OfficeImage";
import CardsSection from "../../components/CardsComponent/CardsSection";
import styles from "./Homepage.module.scss";

import { useState } from "react";
import api from "../../helper/api";

import Input from "antd/lib/input/Input";
import InfiniteScroll from "react-infinite-scroll-component";
import jwtDecode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";

import { fetchEmployees } from "../../utils/fetchEmployees";

import { setEnd, setStart } from "../../redux/Date/Date";
import { DownOutlined } from "@ant-design/icons";
import {
  openError,
  openNotification,
} from "../../components/notification/Notification";

const Home = () => {
  const [officeid, setofficeid] = useState();
  const [selectedCardId, setSelectedCard] = useState([]);
  const [startDateRes, setStartDate] = useState([]);
  const [endDateRes, setEndDate] = useState([]);
  const [refreshCards, setRefreshCards] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectValue, setSelectValue] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [dates, setDates] = useState([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [defValue, setDefValue] = useState("Reserve for Coworker");
  const [selectedCategories, setSelectedCategories] = useState({});
  const [singleMonitor, setSingleMonitor] = useState(false);
  const [dualMonitor, setDualMonitor] = useState(false);
  const [nearWindow, setNearWindow] = useState(false);
  const [dropdownVisible, setDropDownVisible] = useState(false);

  const [selectedCoworker, setSelectedCoworker] = useState({});
  const [showReserveForCoworker, setShowReserveForCoworker] = useState(false);
  const [forCoworker, setForCoworker] = useState(false);
  const dispatch = useDispatch();
  const { employees } = useSelector((state) => state.employees);

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
    setSingleMonitor(!singleMonitor);
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
    setDefValue("Reserve for Coworker");
    setofficeid(value);
    setForCoworker(false);
  }

  function selectedCard(value, availability) {
    setSelectedCard(value);
    setIsAvailable(availability);
  }

  function refresh() {
    setRefreshCards({});
  }

  const showReviewsForSelectedCard = () => {
    setIsModalVisible(true);
    api
      .get(`entity/reviews/${selectedCardId.id}`)
      .then(({ data }) => {
        setReviews(data.allReviews);
      })
      .catch(() => {
        setReviews(["There were no available reviews"]);
      });
  };

  const getUsers = async () => {
    fetchEmployees(api, dispatch);
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
        setDates([]);
        setSelectedCard([]);
        setStartDate([]);
        setEndDate([]);
        setShowReserveForCoworker(false);
        openError(error.response.data);
      });
  };

  const clearDate = () => {
    dispatch(setStart(null));
    dispatch(setEnd(null));
    setDates([]);
  };

  const makeReservation = () => {
    const user = jwtDecode(localStorage.getItem("msal.idtoken"));

    const data = {
      deskId: selectedCardId.id,
      startDate: startDateRes,
      endDate: endDateRes,
      coworkerMail: user.preferred_username,
    };

    sendReservation(data);
  };

  useEffect(() => {}, [selectValue]);

  const changeVal = (e) => {
    console.log(e);
    setSelectValue(e);
  };

  const reserveForCoworker = async (person) => {
    const data = {
      startDate: startDateRes,
      endDate: endDateRes,
      coworkerMail: selectedCoworker.email,
      deskId: selectedCardId.id,
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
        openNotification("You have successfully reserved for your coworker");
        setShowReserveForCoworker(false);
      })
      .catch((error) => {
        console.log(error.response.data);
        setDates([]);
        setSelectedCard([]);
        setStartDate([]);
        setEndDate([]);
        setShowReserveForCoworker(false);
        openError("Error while reserving desk");
      });
  };

  const checkTypeOfReservation = () => {
    if (Object.keys(selectedCoworker) === 0 && forCoworker) {
      openError("Please select your coworker if you have the box checked");
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
      setDefValue("");
      setSelectedCoworker({});
      return;
    }
    const foundEmployee = employees.find(
      (item) => `${item.firstName} ${item.lastName} ${item.jobTitle}` === val
    );
    const name = val.split(" ");
    setDefValue(`${name[0]} ${name[1]}`);
    setSelectedCoworker(foundEmployee);
  };

  return (
    <Layout className={styles.layout}>
      <UserHead isHome={true} />
      <Layout className={styles.homeContent}>
        <Content className={styles.content}>
          <Row align="center" className={styles.leftSideHome}>
            <Col span={10} xl={11} lg={11} md={11}>
              <div className={styles.leftInputRow}>
                <OfficeBranchSelection
                  onOfficebranchChange={changeofficebranch}
                  styles={styles.pStyles}
                />
                <div className={styles.leftInputs}>
                  <p className={styles.pStyles}>Select date</p>
                  <CalendarImplementation
                    dateFunction={setDate}
                    onSelectCard={selectedCard}
                    officeid={officeid}
                    startDate={startDateRes}
                    endDate={endDateRes}
                    dates={dates}
                    clearDate={clearDate}
                  />
                </div>
              </div>
              <Col
                className={`${styles.officeImgCol} ${styles.cardColColor}`}
                // style={{
                //   width: "100%",
                //   display: "flex",
                //   justifyContent: "center",
                // }}
              >
                <OfficeImage officeid={officeid} />
              </Col>
            </Col>
            <Col
              span={11}
              xl={11}
              lg={11}
              md={11}
              className={styles.rightSideHome}
            >
              <div className={styles.rightInputRow}>
                <div>
                  <p className={styles.pStyles}>Search by name</p>
                  <Input
                    className={styles.inputSize}
                    onChange={(e) => setEmployeeSearch(e.target.value)}
                  />
                </div>
                <div>
                  <p className={styles.pStyles}>Filter by availability</p>
                  <Select
                    showSearch
                    className={styles.inputSize}
                    defaultValue={selectValue}
                    onChange={changeVal}
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
                <div>
                  <p className={styles.pStyles}>Filter by category</p>
                  <Dropdown
                    overlay={
                      <Menu className={styles.menu}>
                        <Menu.Item>
                          <Checkbox
                            checked={singleMonitor}
                            onClick={clickSingleMonitor}
                            disabled={dualMonitor}
                          >
                            Single monitor
                          </Checkbox>
                        </Menu.Item>
                        <Menu.Item>
                          <Checkbox
                            checked={dualMonitor}
                            onClick={clickDualMonitor}
                            disabled={singleMonitor}
                          >
                            Dual monitor
                          </Checkbox>
                        </Menu.Item>
                        <Menu.Item>
                          <Checkbox
                            checked={nearWindow}
                            onClick={clickNearWindow}
                          >
                            Near window
                          </Checkbox>
                        </Menu.Item>
                      </Menu>
                    }
                    // trigger={["click"]}
                    visible={dropdownVisible}
                    onClick={() => setDropDownVisible(!dropdownVisible)}
                  >
                    <Button className={styles.inputSize}>
                      <Space>
                        Select categories
                        <DownOutlined />
                      </Space>
                    </Button>
                  </Dropdown>
                </div>
              </div>
              <Col
                className={`${styles.cardsCol} ${styles.cardColColor} ${styles.scrollableDiv}`}
              >
                <CardsSection
                  refresh={refreshCards}
                  selectedCard={selectedCard}
                  officeid={officeid}
                  available={selectValue}
                  employeeSearch={employeeSearch}
                  categories={selectedCategories}
                />
              </Col>
            </Col>
          </Row>

          <Row className={styles.buttonsSection}>
            <div className={styles.buttonReview}>
              <div>
                <Checkbox
                  onClick={() => setForCoworker(!forCoworker)}
                  checked={forCoworker}
                />
                <Select
                  value={defValue}
                  placement={"topRight"}
                  className={styles.inputSize}
                  showSearch
                  onChange={setCoworker}
                  disabled={!forCoworker}
                >
                  <Select.Option value="">None</Select.Option>
                  {employees &&
                    employees.map((item) => (
                      <Select.Option
                        key={item.id}
                        value={`${item.firstName} ${item.lastName} ${item.jobTitle}`}
                        style={{ height: 50 }}
                      >
                        <h4
                          style={{ fontSize: 14, padding: 0, margin: 0 }}
                        >{`${item.firstName} ${item.lastName}`}</h4>
                        <p style={{ fontSize: 9 }}>{item.jobTitle}</p>
                      </Select.Option>
                    ))}
                </Select>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  block
                  disabled={
                    (selectedCardId.length === 0 || !isAvailable
                      ? true
                      : false) ||
                    (startDateRes.length === 0 || endDateRes.length === 0
                      ? true
                      : false) ||
                    (((selectedCardId.length === 0 || !isAvailable
                      ? true
                      : false) ||
                      (startDateRes.length === 0 || endDateRes.length === 0
                        ? true
                        : false)) &&
                    forCoworker &&
                    Object.keys(selectedCoworker).length === 0
                      ? true
                      : false) ||
                    selectedCardId.categories?.unavailable ||
                    defValue.length === 0
                  }
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
                  disabled={selectedCardId.length === 0 ? true : false}
                  size="large"
                  className={`${styles.buttons} ${styles.tealBtn}`}
                  onClick={() => showReviewsForSelectedCard()}
                >
                  Show reviews
                </Button>
              </div>

              <Modal
                maskClosable={false}
                title="Reviews for selected entity"
                visible={isModalVisible}
                onOk={closeModalFunction}
                onCancel={closeModalFunction}
                cancelButtonProps={{ style: { display: "none" } }}
              >
                <InfiniteScroll className={styles.reviewModal} dataLength={3}>
                  <ul>
                    {reviews &&
                      reviews.map((item, id) => <li key={id}>{item}</li>)}
                  </ul>
                </InfiniteScroll>
              </Modal>
              <Modal
                title="Reserve desk for coworker"
                visible={showReserveForCoworker}
                onCancel={() => setShowReserveForCoworker(false)}
                onOk={() => reserveForCoworker(selectedCoworker)}
              >
                Are you sure you want to reserve this desk for{" "}
                {selectedCoworker.firstName} {selectedCoworker.lastName}?
              </Modal>
            </div>
          </Row>

          <Row className={styles.footerSection} align="center">
            <Col align="center" span={24}>
              <p className={styles.footerText}>
                inOffice ©2022 Created by inOfficeTeam
              </p>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;
