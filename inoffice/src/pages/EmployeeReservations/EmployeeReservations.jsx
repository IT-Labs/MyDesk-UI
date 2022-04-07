import React, { Component } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import UserHead from "../../components/Head/UserHead";
import { Card } from 'antd';
import FutureReservations from "./FutureReservations";
import PastReservations from "./PastReservations";
import { useState, useEffect } from "react";


const EmployeeReservationList = () => {

  const [activeTabKey1, setActiveTabKey1] = useState('tab1');
   

  const tabList = [
    {
      key: 'tab1',
      tab: 'Future',
    },
    {
      key: 'tab2',
      tab: 'Past',
    },
  ];
  const contentList = {
    tab1:<FutureReservations />,
    tab2: <PastReservations />,
  };

  const onTab1Change = key => {
    setActiveTabKey1(key);
  };
  
    return (
      <Layout>
        <UserHead />
        <Layout>
          <Sidebar selected="1" />
          <Content>

              <Card
                  style={{ width: '100%' }}
                  title="My reservations"
                  tabList={tabList}
                  activeTabKey={activeTabKey1}
                  onTabChange={key => {
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
export default EmployeeReservationList