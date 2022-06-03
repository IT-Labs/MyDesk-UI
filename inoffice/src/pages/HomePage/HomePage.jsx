import React, { Component, useEffect } from "react";
import UserHead from "../../components/Head/UserHead";
import Layout, { Content } from "antd/lib/layout/layout";
import { Button, Row, Col, notification, Modal, Select } from "antd";
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

  const [selectedCoworker, setSelectedCoworker] = useState("");
  const [showReserveForCoworker, setShowReserveForCoworker] = useState(false);
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

  function changeofficebranch(value) {
    setofficeid(value);
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
    if (employees.length === 0) {
      getUsers();
    }
  }, []);

  const sendReservation = (data) => {
    const config = {
      Authorization: `Bearer ${sessionStorage.getItem("msal.idtoken")}`,
    };
    api
      .post("employee/reserve", data, config)
      .then((response) => {
        refresh();
        setDates([]);
        setSelectedCard([]);
        setStartDate([]);
        setEndDate([]);
        openNotification("top");
      })
      .catch((error) => {
        console.error("error");
      });
  };

  const clearDate = () => {
    setDates([]);
  };

  const makeReservation = () => {
    const data = {
      desk: { ...selectedCardId, categories: "Desk" },
      startDate: startDateRes,
      endDate: endDateRes,
      officeName: selectValue,
    };

    sendReservation(data);
  };

  const [checked, setChecked] = useState(false);

  useEffect(() => {}, [selectValue]);

  const changeVal = (e) => {
    setSelectValue(e);
  };

  const reserveForCoworker = async (person) => {
    const foundEmployee = employees.find(
      (item) => `${item.firstName} ${item.lastName}` === person
    );

    const data = {
      startDate: startDateRes,
      endDate: endDateRes,
      coworkerMail: foundEmployee.email,
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
        console.error("error");
      });
  };

  return (
    <Layout style={{ overflow: "auto", height: "100vh" }}>
      <UserHead isHome={true} />
      <Layout>
        <Content>
          <Row className="firstSection">
            <Col className="officeDropdown" span={11} xl={11} lg={11} md={11}>
              <OfficeBranchSelection
                onOfficebranchChange={changeofficebranch}
              />
            </Col>
            <Col className="calendarSection" span={11} xl={11} lg={11} md={11}>
              <CalendarImplementation
                dateFunction={setDate}
                onSelectCard={selectedCard}
                officeid={officeid}
                startDate={startDateRes}
                endDate={endDateRes}
                dates={dates}
                clearDate={clearDate}
              />
              <div>
                <p style={{ fontSize: "1.2em", fontWeight: "bold" }}>
                  Filter by availability
                </p>
                <Select
                  showSearch
                  style={{ width: 200 }}
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
            </Col>
          </Row>
          <Row align="center">
            <Col
              className="officeImgCol cardColColor"
              span={11}
              xl={11}
              lg={11}
              md={11}
            >
              <OfficeImage officeid={officeid} />
            </Col>

            <Col
              className="cardsCol cardColColor"
              span={11}
              xl={11}
              lg={11}
              md={11}
            >
              <CardsSection
                refresh={refreshCards}
                selectedCard={selectedCard}
                officeid={officeid}
                available={selectValue}
              />
            </Col>
          </Row>

          <Row
            className="buttonsSection"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div
              style={{
                marginLeft: 50,
                display: "flex",
                justifyContent: "space-evenly",
                width: "48%",
                alignItems: "center",
              }}
            >
              <Select
                defaultValue={"Reserve for coworker"}
                placement={"topRight"}
                style={{ width: 250 }}
                showSearch
                onChange={(val) => setSelectedCoworker(val)}
              >
                {employees &&
                  employees.map((item) => (
                    <Select.Option
                      key={item.id}
                      value={`${item.firstName} ${item.lastName}`}
                    >
                      <h4
                        style={{ fontSize: 14 }}
                      >{`${item.firstName} ${item.lastName}`}</h4>
                      <p style={{ fontSize: 9 }}>{item.jobTitle}</p>
                    </Select.Option>
                  ))}
              </Select>
              <Button
                block
                disabled={
                  (selectedCardId.length === 0 || !isAvailable
                    ? true
                    : false) ||
                  (startDateRes.length === 0 || endDateRes.length === 0
                    ? true
                    : false)
                }
                onClick={() => setShowReserveForCoworker(true)}
                type="primary"
                style={{
                  borderRadius: "7px",
                  background: "#5cb1b8",
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
            </div>
            <div
              className="buttonReview"
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                width: "25%",
              }}
            >
              <Button
                block
                disabled={selectedCardId.length === 0 ? true : false}
                type="primary"
                size="large"
                style={{
                  borderRadius: "7px",
                  background: "#5cb1b8",
                  border: "transparent",
                  marginRight: 5,
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
              <Button
                block
                disabled={
                  (selectedCardId.length === 0 || !isAvailable
                    ? true
                    : false) ||
                  (startDateRes.length === 0 || endDateRes.length === 0
                    ? true
                    : false)
                }
                onClick={() => makeReservation()}
                type="primary"
                style={{
                  borderRadius: "7px",
                  background: "#5cb1b8",
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
                {selectedCoworker}?
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
