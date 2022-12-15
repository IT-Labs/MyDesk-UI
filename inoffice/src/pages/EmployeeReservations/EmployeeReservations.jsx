import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import { Card } from "antd";
import FutureReservations from "./FutureReservations/FutureReservations";
import PastReservations from "./PastReservations/PastReservations";
import { useState, useEffect } from "react";
import jwt from "jwt-decode";
import { CardTitle } from "./CardTitle";
import api from "../../helper/api";
import styles from "./Reservation.module.scss";
import MainLayout from "../../layouts/MainLayout";

const EmployeeReservationList = () => {
  const [activeTabKey1, setActiveTabKey1] = useState("tab1");

  const token = jwt(localStorage.getItem("msal.idtoken"));

  const [data, setData] = useState([]);

  useEffect(() => {
    api
      .get("employee/offices")
      .then((res) => {
        const sorted = res.data.sort((a, b) => {
          return a.name < b.name ? -1 : 1;
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

  if (!token.roles || (token.roles && token.roles[0] === "EMPLOYEE")) {
    return (
      <Layout>
        <Sidebar selected="1" />
        <MainLayout isHome={false}>
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
        </MainLayout>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <Sidebar selected="5" />
        <MainLayout isHome={false}>
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
        </MainLayout>
      </Layout>
    );
  }
};
export default EmployeeReservationList;
