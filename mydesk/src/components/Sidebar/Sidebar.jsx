import React, { useEffect, useState } from "react";
import { Menu, Tooltip } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import FeatherIcon from "feather-icons-react";
import Sider from "antd/lib/layout/Sider";
import jwt from "jwt-decode";
import { Link, NavLink } from "react-router-dom";
import styles from "./Sidebar.module.scss";

const Sidebar = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [width, setWidth] = useState("100%");
  const media = window.matchMedia("(max-width: 820px)");
  const config = { token: localStorage.getItem("msal.idtoken") };

  useEffect(() => {
    if (media.matches) {
      setWidth("75%");
      setCollapsed(true);
    }
  }, []);

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
    if (collapsed) {
      setWidth("75%");
    } else {
      setWidth("100%");
    }
  };

  if (
    jwt(config.token).roles &&
    (jwt(config.token).roles[0] === "ADMIN" ||
      jwt(config.token).roles[1] === "ADMIN")
  ) {
    return (
      <Sider
        className={styles.sideBar}
        theme="light"
        collapsible
        collapsed={media.matches ? true : collapsed}
        onCollapse={onCollapse}
        trigger={
          media.matches ? null : !collapsed ? (
            <MenuFoldOutlined
              onClick={() => {
                setCollapsed(true);
              }}
            />
          ) : (
            <MenuUnfoldOutlined
              onClick={() => {
                setCollapsed(false);
              }}
            />
          )
        }
      >
        <Menu
          selectedKeys={[props.selected]}
          mode="inline"
          className="sideMenu"
        >
          <Menu.Item
            key="0"
            className={`${styles.sideBarLogo} sideBarLogo`}
            style={{ width: width }}
          >
            <div>
              <Tooltip title="Home" placement="bottom">
                <NavLink id="myDeskLogo" to="/employee/home"></NavLink>
              </Tooltip>
            </div>
          </Menu.Item>
          <Menu.Item key="1" icon={<FeatherIcon icon="home" />}>
            <Tooltip title="Dashboard">
              <Link to={"/admin/dashboard"}>
                {!collapsed && <>Dashboard</>}
              </Link>
            </Tooltip>
          </Menu.Item>
          <Menu.Item key="2" icon={<FeatherIcon icon="code" />}>
            <Tooltip title="Offices">
              <Link to={"/admin/offices"}>{!collapsed && <>Offices</>}</Link>
            </Tooltip>
          </Menu.Item>
          <Menu.Item key="4" icon={<FeatherIcon icon="coffee" />}>
            <Tooltip title="Reservation list">
              <Link to={"/admin/reservations"}>
                {!collapsed && <>Reservation list</>}
              </Link>
            </Tooltip>
          </Menu.Item>
          <Menu.Item key="5" icon={<FeatherIcon icon="coffee" />}>
            <Tooltip title="My reservations">
              <Link to={"/employee/reservations"}>
                {!collapsed && <>My reservations</>}
              </Link>
            </Tooltip>
          </Menu.Item>
          <Menu.Item key="6" icon={<FeatherIcon icon="users" />}>
            <Tooltip title="Users">
              <Link to={"/admin/users"}>{!collapsed && <>Users</>}</Link>
            </Tooltip>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }

  return (
    <Sider
      className={styles.sideBar}
      theme="light"
      collapsible
      collapsed={media.matches ? true : collapsed}
      onCollapse={onCollapse}
      trigger={
        media.matches ? null : !collapsed ? (
          <MenuFoldOutlined
            onClick={() => {
              setCollapsed(true);
            }}
          />
        ) : (
          <MenuUnfoldOutlined
            onClick={() => {
              setCollapsed(false);
            }}
          />
        )
      }
    >
      <Menu
        theme="light"
        selectedKeys={[props.selected]}
        mode="inline"
        className="sideMenu"
      >
        <Menu.Item
          key="00"
          className={`${styles.sideBarLogo} sideBarLogo`}
          style={{ width: width }}
        >
          <div>
            <Tooltip title="Home" placement="bottom">
              <NavLink id="myDeskLogo" to="/employee/home"></NavLink>
            </Tooltip>
          </div>
        </Menu.Item>
        <Menu.Item key="01" icon={<FeatherIcon icon="coffee" />}>
          <Tooltip title="My reservations">
            <Link to={"/employee/reservations"}>
              {!collapsed && <>My reservations</>}
            </Link>
          </Tooltip>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};
export default Sidebar;
