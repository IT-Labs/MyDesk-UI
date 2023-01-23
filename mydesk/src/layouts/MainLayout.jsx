import React from "react";
import HeaderBar from "./HeaderBar/HeaderBar";
import { Layout } from "antd";
import styles from "./MainLayout.module.scss";

const { Footer } = Layout;

const MainLayout = ({ children, isHome, isDashboard, ...props }) => {
  return (
    <Layout>
      <HeaderBar isHome={isHome} isDashboard={isDashboard} />
      <div
        className={
          isHome
            ? styles.contentChildrenHome
            : isDashboard
            ? styles.contentChildrenDashboard
            : styles.contentChildren
        }
      >
        {children}
      </div>

      <Footer className={isHome ? styles.footer : styles.footerDashboard}>
        MyDesk ©2022 Created by MyDeskTeam
      </Footer>
    </Layout>
  );
};

export default MainLayout;
