import React from "react";
import "./Sidebar.css";
import { Menu } from "antd";
import { Component } from "react/cjs/react.production.min";
import {
  DesktopOutlined,
  PieChartOutlined,
  FolderOutlined,
  TeamOutlined,
  FileOutlined,
} from "@ant-design/icons";
import FeatherIcon from "feather-icons-react";
import Sider from "antd/lib/layout/Sider";
import jwt from "jwt-decode";
import { Link, NavLink } from "react-router-dom";

class SiderDemo extends Component {
  state = {
    collapsed: false,
    width: "100%",
  };

  config = {
    token: localStorage.getItem("msal.idtoken"),
  };

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
    if (collapsed) {
      this.setState({ width: "75%" });
    } else {
      this.setState({ width: "100%" });
    }
  };

  render() {
    const { collapsed } = this.state;
    if (jwt(this.config.token).roles[0] === "ADMIN") {
      return (
        <Sider
          style={{
            overflow: "auto",
            height: "100vh",
            position: "relative",
            top: "-70px",
            left: 0,
          }}
          theme="light"
          collapsible
          collapsed={collapsed}
          onCollapse={this.onCollapse}
        >
          <Menu
            selectedKeys={[this.props.selected]}
            mode="inline"
            className="sideMenu"
          >
            <Menu.Item
              key="0"
              className="sideBarLogo"
              style={{ width: this.state.width }}
            >
              <NavLink id="inOfficeLogo" to="/employee/home"></NavLink>
            </Menu.Item>
            <Menu.Item key="1" icon={<FeatherIcon icon="home" />}>
              <Link to={"/admin/dashboard"}>
                {!this.state.collapsed && <>Dashboard</>}
              </Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<FeatherIcon icon="code" />}>
              <Link to={"/admin/offices"}>
                {!this.state.collapsed && <>Offices</>}
              </Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<FeatherIcon icon="settings" />}>
              <Link to={"/admin/configuration"}>
                {!this.state.collapsed && <>Configuration</>}
              </Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<FeatherIcon icon="coffee" />}>
              <Link to={"/admin/reservations"}>
                {!this.state.collapsed && <>Reservation List</>}
              </Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<FeatherIcon icon="coffee" />}>
              <Link to={"/employee/reservations"}>
                {!this.state.collapsed && <>My Reservations</>}
              </Link>
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
        <Menu theme="light" selectedKeys={[this.props.selected]} mode="inline">
          <Menu.Item key="1" icon={<TeamOutlined />}>
            <Link to={"/employee/reservations"}>My reservations</Link>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}

export default SiderDemo;
