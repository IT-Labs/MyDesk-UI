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

const Home = () => {
  const dateFormat = "DD/MM/YYYY";
  const [officeid, setofficeid] = useState();
  const [selectedCardId, setSelectedCard] = useState([]);
  const [startDateRes, setStartDate] = useState(
    moment(new Date(), dateFormat).add(1, "days").format("DD-MM-YYYY")
  );
  const [endDateRes, setEndDate] = useState(
    moment(new Date(), dateFormat).add(2, "days").format("DD-MM-YYYY")
  );
  const [refreshCards, setRefreshCards] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reload, setReload] = useState(false);
  const [selectValue, setSelectValue] = useState(1);
  const [reviews, setReviews] = useState([]);

  const closeModalFunction = () => {
    setIsModalVisible(false);
    setReviews([]);
  };

  function setDate(startDate, endDate) {
    setStartDate(startDate);
    setEndDate(endDate);
  }

  function changeofficebranch(value) {
    setofficeid(value);
  }

  function selectedCard(value) {
    setSelectedCard(value);
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

  const sendReservation = (data) => {
    const config = {
      Authorization: `Bearer ${sessionStorage.getItem("msal.idtoken")}`,
    };
    api
      .post("employee/reserve", data, config)
      .then((response) => {
        refresh();
        openNotification("top");
      })
      .catch((error) => {
        console.error("error");
      });
  };

  const makeReservation = () => {
    const typeDefined = selectedCardId.categories ? "Desk" : "ConferenceRoom";

    const data = {
      [typeDefined]: selectedCardId,
      startDate: startDateRes,
      endDate: endDateRes,
    };

    sendReservation(data);
  };

  const [checked, setChecked] = useState(false);

  useEffect(() => {}, [selectValue]);

  const changeVal = (e) => {
    setSelectValue(e);
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
                  <Select.Option value={1} key={1}>
                    All
                  </Select.Option>
                  <Select.Option value={2} key={2}>
                    Available
                  </Select.Option>
                  <Select.Option value={3} key={3}>
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

          <Row className="buttonsSection">
            <Col className="buttonReview" span={2}>
              <Button
                block
                disabled={selectedCardId.length === 0 ? true : false}
                type="primary"
                size="large"
                style={{
                  borderRadius: "7px",
                  background: "#5cb1b8",
                  border: "transparent",
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
              <Modal
                maskClosable={false}
                title="Reviews for selected entity"
                visible={isModalVisible}
                onOk={closeModalFunction}
                onCancel={closeModalFunction}
              >
                <ul>
                  {reviews &&
                    reviews.map((item, id) => <li key={id}>{item}</li>)}
                </ul>
              </Modal>
            </Col>
            <Col className="buttonReserve" span={2}>
              <Button
                block
                disabled={
                  (selectedCardId.length === 0 || selectedCardId.reservationId
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
            </Col>
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
