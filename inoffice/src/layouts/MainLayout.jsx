import React from "react";
import HeaderBar from "./HeaderBar/HeaderBar";
import { Layout } from "antd";
import styles from "./MainLayout.module.scss";

const { Footer } = Layout;

const MainLayout = ({ children, isHome, isDashboard, ...props }) => {
  return (
    <Layout>
      <HeaderBar isHome={isHome} />
      <div
        className={
          isHome || isDashboard
            ? styles.contentChildrenAutoHeight
            : styles.contentChildren
        }
      >
        {children}
      </div>

      <Footer className={styles.footer}>
        MyDesk ©2022 Created by MyDeskTeam
      </Footer>
    </Layout>
  );
};

export default MainLayout;
