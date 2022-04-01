import React, { Component } from "react";
import UserHead from "../../components/Head/UserHead";
import Layout, { Content, Footer } from "antd/lib/layout/layout";
import { Button, Row, Col, notification } from "antd";
import { Space } from "antd";
import OfficeBranchSelection from "../../components/inputs/OfficeBranchSelection";
import CalendarImplementation from "../../components/inputs/CalendarImplementation";
import OfficeImage from "../../components/inputs/OfficeImage";
import CardsSection from "../../components/CardsComponent/CardsSection";
import { useState } from "react";
import api from "../../helper/api";

const Home = () => {
  const [officeid, setofficeid] = useState();
  const [selectedCardId, setSelectedCard] = useState([]);
  const [startDateRes, setStartDate] = useState([]);
  const [endDateRes, setEndDate] = useState([]);
  const [refreshCards, setRefreshCards] = useState();

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

  const openNotification = (placement) => {
    notification.info({
      message: `Notification`,
      description: " You succesfully made a reservation",
      placement,
    });
  };

  const sendReservation = (data) => {
    api
      .post("employee/reserve", data)
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
    <div>
      <Layout style={{ height: "100vh" }}>
        <UserHead />
        <div style={{ overflow: "hidden" }}>
          <Content>
            <Space>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={24}>
                  <div></div>
                </Col>
              </Row>
            </Space>
            <Row align="top" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={1}></Col>
              <Col span={3}>
                <OfficeBranchSelection
                  onOfficebranchChange={changeofficebranch}
                />
              </Col>
              <Col span={1}></Col>
              <Col span={3}></Col>
              <Col span={1}></Col>
              <Col span={3}></Col>
              <Col span={4}>
                <CalendarImplementation
                  dateFunction={setDate}
                  onSelectCard={selectedCard}
                  officeid={officeid}
                />
              </Col>
              <Col span={4}></Col>
              <Col span={1}></Col>

              <Col span={1}></Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={1}></Col>
              <Col span={11}>
                <OfficeImage officeid={officeid} />
              </Col>
              <Col span={11}>
                <CardsSection
                  refresh={refreshCards}
                  selectedCard={selectedCard}
                  officeid={officeid}
                />
              </Col>
              <Col span={1}>
                <div></div>
              </Col>
            </Row>
            <Space>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={24}>
                  <div></div>
                </Col>
              </Row>
            </Space>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={19}></Col>
              <Col span={2}>
                <Button block type="primary" shape="round" size="large">
                  Show reviews
                </Button>
              </Col>
              <Col span={2}>
                <Button
                  block
                  disabled={selectedCardId.reservationId ? true : false}
                  onClick={() => makeReservation()}
                  type="primary"
                  shape="round"
                  size="large"
                >
                  Reserve
                </Button>
              </Col>
            </Row>
          </Content>
        </div>
        <Footer style={{ textAlign: "center", fontSize: "1.4em" }}>
          inOffice ©2022 Created by ScrumDogMillionaires
        </Footer>
      </Layout>
    </div>
  );
};
export default Home;
