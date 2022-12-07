import Sidebar from "../../components/Sidebar/Sidebar";
import api from "../../helper/api";
import Layout, { Content } from "antd/lib/layout/layout";
import UserHeade from "../../components/Head/UserHead";
import { Button, List, Card, Input } from "antd";
import { Popconfirm, Row, Col } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import "./Users.css";
import Title from "./Title";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOffices } from "../../redux/Offices/offices";
import { fetchEmployees } from "../../utils/fetchEmployees";
import {
  openError,
  openNotification,
} from "../../components/notification/Notification";

const Users = () => {
  const [inputFilter, setInputFilter] = useState("");
  const office = useSelector((state) => state.offices.offices);
  const { decodedUser } = useSelector((state) => state.user);
  const employees = useSelector((state) => state.employees.employees);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOffices());
  }, []);

  const getUsers = async () => {
    fetchEmployees(dispatch, decodedUser);
  };

  const assignAsAdmin = (value) => {
    const body = {
      isAdmin: false,
    };

    api
      .put(`/admin/employee/${value.id}`, body)
      .then((res) => {
        openNotification(
          `${value.firstName} ${value.surname} has been made admin successfully.`
        );
      })
      .catch((err) => {
        openError(err.response.data[0]);
        console.log(err.response);
      });
  };

  const handleChange = (e) => {
    setInputFilter(e.target.value);
  };

  const onSubmit = () => {
    getUsers();
  };
  return (
    <>
      <Layout>
        <UserHeade />
        <Layout>
          <Sidebar selected="6" />
          <Content
            style={{
              display: "flex",
              justifyContent: "top",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Row
              style={{
                background: "transparent",
                width: "80%",
                borderRadius: "14px",
                border: 0,
              }}
            >
              <Col span={24}>
                <Card
                  title={
                    <Title
                      officeName={office ? office[0]?.name : "Office"}
                      addUserTextBtn="Add user"
                      onSubmit={onSubmit}
                    />
                  }
                  style={{
                    boxShadow: "0 2px 2px 1px #2c28283c",
                    padding: "10px",
                    borderRadius: 7,
                  }}
                >
                  <div style={{ overflowX: "scroll" }}>
                    <Input
                      style={{ width: 200 }}
                      onChange={handleChange}
                      placeholder="Search Users"
                    />
                    <List
                      bordered
                      style={{ minWidth: 400 }}
                      pagination={{ pageSize: 5, position: "bottom" }}
                      dataSource={employees.filter(
                        ({ firstName, surname }) =>
                          firstName
                            .toLowerCase()
                            .includes(inputFilter.toLowerCase()) ||
                          surname
                            .toLowerCase()
                            .includes(inputFilter.toLowerCase())
                      )}
                      renderItem={(user) => (
                        <List.Item>
                          <span>{`${user.firstName} ${user.surname}`}</span>
                          <Popconfirm
                            title="Do you want to assign this user as admin?"
                            onConfirm={() => assignAsAdmin(user)}
                            okText="Yes"
                            cancelText="No"
                            className="assignAsAdminButton"
                            shape="round"
                            placement="topRight"
                            icon={
                              <QuestionCircleOutlined
                                style={{ color: "red" }}
                              />
                            }
                          >
                            <Button
                              type="primary"
                              style={{
                                border: "0",
                                borderRadius: "5px",
                                boxShadow: " 0px 3px 6px #2C28281C",
                              }}
                            >
                              Assign as admin
                            </Button>
                          </Popconfirm>
                        </List.Item>
                      )}
                    />
                  </div>
                </Card>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
      <Row
        style={{
          marginTop: "2%",
        }}
        align="center"
      >
        <Col align="center" span={24}>
          <p
            style={{
              fontSize: "1.2em",
            }}
          >
            MyDesk ©2022 Created by MyDeskTeam
          </p>
        </Col>
      </Row>
    </>
  );
};

export default Users;
