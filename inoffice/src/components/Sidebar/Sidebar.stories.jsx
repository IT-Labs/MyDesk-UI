import React, { useState, useEffect } from "react";
import Sider from "antd/lib/layout/Sider";

import { Menu, Tooltip } from "antd";

import FeatherIcon from "feather-icons-react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

export default {
  title: "Sidebar",
  component: Sider,
};

export const Sidebar = () => {
  const [selected, setSelected] = useState(1);
  const [collapsed, setCollapsed] = useState(false);
  const [width, setWidth] = useState("100%");
  const media = window.matchMedia("(max-width: 820px)");

  useEffect(() => {
    if (media.matches) {
      setWidth("75%");
      setCollapsed(true);
    }
  }, []);

  const onCollapse = (collapsed) => {
    console.log(collapsed);
    setCollapsed(collapsed);
    if (collapsed) {
      setWidth("75%");
    } else {
      setWidth("100%");
    }
  };
  return (
    <div>
      <p>
        The sidebar is used when we want to travel from one part of the
        application to another. Here as an employee we only have access to my
        reservations, but as an admin, we can access the dashboard, see the list
        of offices, see all reservations made, and also check on our own
        reservations
      </p>
      <Sider
        theme="light"
        collapsible
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
        <Menu selectedKeys={selected} mode="inline" className="sideMenu">
          <Menu.Item key="0" className="sideBarLogo" style={{ width: width }}>
            <div>
              <Tooltip title="Home" placement="bottom">
                <span id="inOfficeLogo" to="/employee/home"></span>
              </Tooltip>
            </div>
          </Menu.Item>
          <Menu.Item key="1" icon={<FeatherIcon icon="home" />}>
            <Tooltip title="Dashboard">
              <span>{!collapsed && <>Dashboard</>}</span>
            </Tooltip>
          </Menu.Item>
          <Menu.Item key="2" icon={<FeatherIcon icon="code" />}>
            <Tooltip title="Offices">
              <span>{!collapsed && <>Offices</>}</span>
            </Tooltip>
          </Menu.Item>
          <Menu.Item key="4" icon={<FeatherIcon icon="coffee" />}>
            <Tooltip title="Reservation list">
              <span>{!collapsed && <>Reservation list</>}</span>
            </Tooltip>
          </Menu.Item>
          <Menu.Item key="5" icon={<FeatherIcon icon="coffee" />}>
            <Tooltip title="My reservations">
              <span>{!collapsed && <>My reservations</>}</span>
            </Tooltip>
          </Menu.Item>
        </Menu>
      </Sider>
    </div>
  );
};
