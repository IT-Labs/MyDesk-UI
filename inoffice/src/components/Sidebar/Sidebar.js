import React from "react";
import "./Sidebar.css";
import { Menu } from "antd";
import { Component } from "react/cjs/react.production.min";
import {
  DesktopOutlined,
  PieChartOutlined,
  FolderOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import Sider from "antd/lib/layout/Sider";
import jwt from "jwt-decode";
import { Link } from "react-router-dom";

class SiderDemo extends Component {
  state = {
    collapsed: false,
  };

  config = {
    token: localStorage.getItem("msal.idtoken"),
  };

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;
    if (jwt(this.config.token).roles[0] == "ADMIN") {
      return (
        <Sider
          style={{
            overflow: "auto",
            height: "100vh",
            position: "sticky",
            top: 0,
            left: 0,
          }}
          collapsible
          collapsed={collapsed}
          onCollapse={this.onCollapse}
        >
          <Menu theme="dark" selectedKeys={[this.props.selected]} mode="inline">
            <Menu.Item key="1" icon={<PieChartOutlined />}>
              <Link to={"/admin/dashboard"}>Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<DesktopOutlined />}>
              <Link to={"/admin/offices"}>Offices</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<FolderOutlined />}>
              <Link to={"/admin/configuration"}>Configuration</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<TeamOutlined />}>
              <Link to={"/admin/reservations"}>Reservation list</Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<TeamOutlined />}>
              <Link to={"/employee/reservations"}>My reservations</Link>
            </Menu.Item>
          </Menu>
        </Sider>
      );
    }

    return (
      <Sider
        style={{ minHeight: "93vh" }}
        collapsible
        collapsed={collapsed}
        onCollapse={this.onCollapse}
      >
        <Menu theme="dark" selectedKeys={[this.props.selected]} mode="inline">
          <Menu.Item key="1" icon={<TeamOutlined />}>
            <Link to={"/employee/reservations"}>My reservations</Link>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}

export default SiderDemo;
