import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import { Card } from "antd";
import FutureReservations from "./FutureReservations/FutureReservations";
import PastReservations from "./PastReservations/PastReservations";
import { useState, useEffect } from "react";
import jwt from "jwt-decode";
import { CardTitle } from "./CardTitle";
import styles from "./Reservation.module.scss";
import { fetchAllOfficesApi } from "../../services/office.service";
import MainLayout from "../../layouts/MainLayout";
import { sortByName } from "../../utils/sortByName";

const EmployeeReservationList = () => {
  const media = window.matchMedia("(max-width: 820px)");
  const [activeTabKey1, setActiveTabKey1] = useState("tab1");
  const token = jwt(localStorage.getItem("msal.idtoken"));
  const [data, setData] = useState([]);
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

  useEffect(() => {
    fetchAllOfficesApi().then((res) => {
      const sorted = sortByName(res.data);
      setData(sorted);
    });
  }, []);

  if (!token.roles || (token.roles && token.roles[0] === "EMPLOYEE")) {
    return (
      <Layout>
        <div>{!media.matches && <Sidebar selected="1" />}</div>
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
        <div>{!media.matches && <Sidebar selected="5" />}</div>
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
