import React, { Component } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import UserHead from "../../components/Head/UserHead";
import { Card, Select } from "antd";
import FutureReservations from "./FutureReservations";
import PastReservations from "./PastReservations";
import { useState, useEffect } from "react";
import jwt from "jwt-decode";
import { CardTitle } from "./CardTitle";
import api from "../../helper/api";

const cardStyles = {
  width: "80%",
  height: "100%",
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

  const token = jwt(sessionStorage.getItem("msal.idtoken"));

  const [data, setData] = useState([]);

  useEffect(() => {
    api
      .get("admin/offices")
      .then((res) => {
        setData(res.data);
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
      <Layout>
        <UserHead />
        <Layout>
          <Sidebar selected="1" />

          <Content style={contentStyle}>
            <Card
              style={cardStyles}
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
    );
  }
};
export default EmployeeReservationList;
