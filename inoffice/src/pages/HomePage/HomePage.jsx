import React, { Component, useEffect } from "react";
import UserHead from "../../components/Head/UserHead";
import Layout, { Content } from "antd/lib/layout/layout";
import {
  Button,
  Row,
  Col,
  notification,
  Modal,
  Select,
  Checkbox,
  Menu,
  Dropdown,
  Space,
} from "antd";
import OfficeBranchSelection from "../../components/inputs/OfficeBranchSelection";
import CalendarImplementation from "../../components/inputs/CalendarImplementation";
import OfficeImage from "../../components/inputs/OfficeImage";
import CardsSection from "../../components/CardsComponent/CardsSection";
import Availability from "../../components/inputs/Availability";
import moment from "moment";
import { useState } from "react";
import api from "../../helper/api";
import "../EditOffice/editoffice.css";
import "../HomePage/homepage.css";
import Input from "antd/lib/input/Input";
import InfiniteScroll from "react-infinite-scroll-component";
import jwtDecode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { setEmployees } from "../../redux/Employees/employees";
import { fetchEmployees } from "../../utils/fetchEmployees";
import UserSearch from "../../components/UserSearch/UserSearch";
import axios from "axios";
import { setEnd, setStart } from "../../redux/Date/Date";
import {
  ClearOutlined,
  CloseCircleOutlined,
  DownOutlined,
} from "@ant-design/icons";

const OPTIONS = ["Single monitor", "Dual Monitor", "Near Window"];

const Home = () => {
  const dateFormat = "DD/MM/YYYY";
  const [officeid, setofficeid] = useState();
  const [selectedCardId, setSelectedCard] = useState([]);
  const [startDateRes, setStartDate] = useState([]);
  const [endDateRes, setEndDate] = useState([]);
  const [refreshCards, setRefreshCards] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reload, setReload] = useState(false);
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

  const openNotification = (placement) => {
    notification.info({
      message: `Notification`,
      description: "You have successfully made a reservation",
      duration: 2,
      placement,
    });
  };

  useEffect(() => {
    setReload(true);
  });

  const getUsers = async () => {
    fetchEmployees(api, dispatch, notification);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const sendReservation = (data) => {
    const config = {
      Authorization: `Bearer ${sessionStorage.getItem("msal.idtoken")}`,
    };
    api
      .post("employee/reserve/coworker", data, config)
      .then((response) => {
        refresh();
        setDates([]);
        setSelectedCard([]);
        setStartDate([]);
        setEndDate([]);
        openNotification("top");
      })
      .catch((error) => {
        setDates([]);
        setSelectedCard([]);
        setStartDate([]);
        setEndDate([]);
        setShowReserveForCoworker(false);
        notification.open({
          message: `Error`,
          description: `${error.response.data}`,
          duration: 2,
          placement: "top",
        });
      });
  };

  const clearDate = () => {
    dispatch(setStart(null));
    dispatch(setEnd(null));
    setDates([]);
  };

  const makeReservation = () => {
    const user = jwtDecode(sessionStorage.getItem("msal.idtoken"));

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
      Authorization: `Bearer ${sessionStorage.getItem("msal.idtoken")}`,
    };
    api
      .post("employee/reserve/coworker", data, config)
      .then((response) => {
        refresh();
        setDates([]);
        setSelectedCard([]);
        setStartDate([]);
        setEndDate([]);
        openNotification("top");
        setShowReserveForCoworker(false);
      })
      .catch((error) => {
        console.log(error.response.data);
        setDates([]);
        setSelectedCard([]);
        setStartDate([]);
        setEndDate([]);
        setShowReserveForCoworker(false);
        notification.open({
          message: `Notification`,
          description: "Error while making this reservation",
          duration: 2,
          placement: "top",
        });
      });
  };

  const checkTypeOfReservation = () => {
    if (Object.keys(selectedCoworker) === 0 && forCoworker) {
      notification.open({
        message: "Error",
        description: "Please select your coworker if you have the box checked",
        duration: 3,
        placement: "top",
      });
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
    <Layout style={{ overflow: "auto", height: "100vh" }}>
      <UserHead isHome={true} />
      <Layout className="homeContent">
        <Content style={{ marginTop: "1rem" }}>
          <Row align="center" className="leftSideHome">
            <Col span={10} xl={11} lg={11} md={11}>
              <div className="leftInputRow">
                <OfficeBranchSelection
                  onOfficebranchChange={changeofficebranch}
                />
                <div style={{ width: "18.75rem" }}>
                  <p style={{ fontSize: "1.2em", fontWeight: "bold" }}>
                    Select date
                  </p>
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
                className="officeImgCol cardColColor"
                style={{ width: "100%" }}
              >
                <OfficeImage officeid={officeid} />
              </Col>
            </Col>
            <Col span={11} xl={11} lg={11} md={11} className="rightSideHome">
              <div className="rightInputRow">
                <div>
                  <p style={{ fontSize: "1.2em", fontWeight: "bold" }}>
                    Search by name
                  </p>
                  <Input
                    style={{ width: "12.5rem" }}
                    onChange={(e) => setEmployeeSearch(e.target.value)}
                  />
                </div>
                <div>
                  <p style={{ fontSize: "1.2em", fontWeight: "bold" }}>
                    Filter by availability
                  </p>
                  <Select
                    showSearch
                    style={{ width: "12.5rem" }}
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
                  <p style={{ fontSize: "1.2em", fontWeight: "bold" }}>
                    Filter by category
                  </p>
                  <Dropdown
                    overlay={
                      <Menu
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
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
                    <Button style={{ width: "12.5rem" }}>
                      <Space>
                        Select categories
                        <DownOutlined />
                      </Space>
                    </Button>
                  </Dropdown>
                </div>
              </div>
              <Col className="cardsCol cardColColor scrollableDiv">
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

          <Row className="buttonsSection">
            <div
              className="buttonReview"
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                width: "53%",
              }}
            >
              <div>
                <Checkbox
                  style={{ width: 30, height: 30 }}
                  onClick={() => setForCoworker(!forCoworker)}
                  checked={forCoworker}
                />
                <Select
                  value={defValue}
                  placement={"topRight"}
                  style={{ width: 250 }}
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
              <div>
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
                  type="primary"
                  style={{
                    borderRadius: "7px",
                    background: forCoworker ? "orange" : "#5cb1b8",
                    border: "transparent",
                    width: 130,
                  }}
                  size="large"
                >
                  <p
                    style={{
                      fontSize: "0.8vw",
                      justifyContent: "center",
                      marginBottom: 0,
                    }}
                  >
                    Reserve
                  </p>
                </Button>
                <Button
                  block
                  disabled={selectedCardId.length === 0 ? true : false}
                  type="primary"
                  size="large"
                  style={{
                    borderRadius: "7px",
                    background: "#5cb1b8",
                    border: "transparent",
                    marginLeft: 5,
                    width: 130,
                  }}
                  onClick={() => showReviewsForSelectedCard()}
                >
                  <p
                    style={{
                      fontSize: "0.8vw",
                      justifyContent: "center",
                      marginBottom: 0,
                    }}
                  >
                    Show reviews
                  </p>
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
                <InfiniteScroll className="reviewModal" dataLength={3}>
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

          <Row className="footerSection" align="center">
            <Col align="center" span={24}>
              <p className="footerText">
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
