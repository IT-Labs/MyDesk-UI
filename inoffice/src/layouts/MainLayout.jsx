import React from "react";
import HeaderBar from "./HeaderBar/HeaderBar";
import { Layout } from "antd";

const { Footer } = Layout;

const MainLayout = ({ children, isHome, ...props }) => {
  return (
    <Layout>
      <HeaderBar isHome={isHome} />
      <div>{children}</div>
      <Footer style={{ textAlign: "center" }}>
        MyDesk ©2022 Created by MyDeskTeam
      </Footer>
    </Layout>
  );
};

export default MainLayout;
