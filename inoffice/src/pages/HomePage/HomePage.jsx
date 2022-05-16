import React, { Component, useEffect } from "react";
import UserHead from "../../components/Head/UserHead";
import Layout, { Content } from "antd/lib/layout/layout";
import { Button, Row, Col, notification, Modal } from "antd";
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

  const closeModalFunction = () => {
    setIsModalVisible(false);
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
      Authorization: `Bearer ${localStorage.getItem("msal.idtoken")}`,
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  width: "100px",
                }}
              >
                <label htmlFor="available">Filter by available</label>
                <input name="available" type="checkbox" />
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
                  {" "}
                  Show reviews
                </p>
              </Button>
              <Modal
                title="Reviews for selected entity"
                visible={isModalVisible}
                onOk={closeModalFunction}
                onCancel={closeModalFunction}
              >
                <p>Desk was very good</p>
                <p>I didn't have a good time</p>
                <p>The desk was broken and the mouse was getting stuck</p>
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
