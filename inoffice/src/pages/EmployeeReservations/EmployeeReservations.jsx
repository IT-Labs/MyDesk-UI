import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import UserHead from "../../components/Head/UserHead";
import { Card, Row, Col } from "antd";
import FutureReservations from "./FutureReservations/FutureReservations";
import PastReservations from "./PastReservations/PastReservations";
import { useState, useEffect } from "react";
import jwt from "jwt-decode";
import { CardTitle } from "./CardTitle";
import api from "../../helper/api";
import styles from "./Reservation.module.scss";

const EmployeeReservationList = () => {
  const [activeTabKey1, setActiveTabKey1] = useState("tab1");

  const token = jwt(localStorage.getItem("msal.idtoken"));

  const [data, setData] = useState([]);

  useEffect(() => {
    api
      .get("admin/offices")
      .then((res) => {
        const sorted = res.data.sort((a, b) => {
          return a.name < b.name ? -1 : b.name > a.name ? 1 : 0;
        });
        setData(sorted);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const tabList = [
    {
      key: "tab1",
      tab: "Future",
    },
    {
      key: "tab2",
      tab: "Past",
    },
  ];
  const contentList = {
    tab1: <FutureReservations />,
    tab2: <PastReservations />,
  };

  const onTab1Change = (key) => {
    setActiveTabKey1(key);
  };

  if (token.roles[0] === "EMPLOYEE") {
    return (
      <>
        <Layout>
          <UserHead />
          <Layout>
            <Sidebar selected="1" />

            <Content className={styles.contentStyle}>
              <Card
                className={styles.cardStyle}
                title={<CardTitle data={data} />}
                tabList={tabList}
                activeTabKey={activeTabKey1}
                onTabChange={(key) => {
                  onTab1Change(key);
                }}
              >
                {contentList[activeTabKey1]}
              </Card>
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
  } else {
    return (
      <>
        <Layout>
          <UserHead />
          <Layout>
            <Sidebar selected="5" />
            <Content className={styles.contentStyle}>
              <Card
                className={styles.cardStyle}
                title={<CardTitle data={data} />}
                tabList={tabList}
                activeTabKey={activeTabKey1}
                onTabChange={(key) => {
                  onTab1Change(key);
                }}
              >
                {contentList[activeTabKey1]}
              </Card>
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
  }
};
export default EmployeeReservationList;
