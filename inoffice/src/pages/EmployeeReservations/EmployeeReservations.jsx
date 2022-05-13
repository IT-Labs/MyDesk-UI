import React, { Component } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import UserHead from "../../components/Head/UserHead";
import { Card, Select } from "antd";
import FutureReservations from "./FutureReservations";
import PastReservations from "./PastReservations";
import { useState, useEffect } from "react";
import jwt from "jwt-decode";

const cardStyles = {
  width: "80%",
  backgroundColor: "white",
  boxShadow: "0px 2px 6px #2C28281C",
  borderRadius: "10px",
};

const contentStyle = {
  display: "flex",
  justifyContent: "center",
  height: "100%",
};

const EmployeeReservationList = () => {
  const [activeTabKey1, setActiveTabKey1] = useState("tab1");

  const token = jwt(localStorage.getItem("msal.idtoken"));

  const sortByOldest = (reservations) => {
    const sorted = reservations.sort((a, b) => {
      return a.StartDate < b.startDate ? -1 : a.StartDate > b.StartDate ? 1 : 0;
    });

    return sorted;
  };

  const sortByNewest = (reservations) => {
    const sorted = reservations.sort((a, b) => {
      return a.StartDate > b.startDate ? -1 : a.StartDate < b.StartDate ? 1 : 0;
    });

    return sorted;
  };

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
      <Layout>
        <UserHead />
        <Layout>
          <Sidebar selected="1" />

          <Content style={contentStyle}>
            <Card
              style={cardStyles}
              title="My reservations"
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
    );
  } else {
    return (
      <Layout>
        <UserHead />
        <Layout>
          <Sidebar selected="5" />
          <Content style={contentStyle}>
            <Card
              style={cardStyles}
              title="My reservations"
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
    );
  }
};
export default EmployeeReservationList;
