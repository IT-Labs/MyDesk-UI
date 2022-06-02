import { Component } from "react/cjs/react.production.min";
import Sidebar from "../../components/Sidebar/Sidebar";
import api from "../../helper/api";
import Layout, { Content, Footer } from "antd/lib/layout/layout";
import UserHeade from "../../components/Head/UserHead";
import { Button, Typography, List, Card, Input } from "antd";
import AddOfficeContainer from "./AddOfficeContainer";
import { Popconfirm, Row, Col, notification } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

import "../Offices/Offices.css";
import Title from "./Title";
import { useEffect, useState } from "react";

const Offices = () => {
  const [inputFilter, setInputFilter] = useState("");
  const [data, setData] = useState([]);

  const openNotification = (placement) => {
    notification.info({
      message: `Notification`,
      description: " You succesfully deleted the office",
      duration: 2,
      placement,
    });
  };

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

  const deleteFunc = (value) => {
    api.delete("admin/office/" + value).then(() => {
      api.get("admin/offices").then((res) => {
        setData(res.data);
      });
    });
  };

  const handleChange = (e) => {
    setInputFilter(e.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault(event);
  };

  const addOfficeText = "Add office";

  return (
    <Layout>
      <UserHeade />
      <Layout>
        <Sidebar selected="2" />
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
                  <Title onSubmit={onSubmit} addOfficeText={addOfficeText} />
                }
                style={{
                  boxShadow: "0 2px 2px 1px #2c28283c",
                  padding: "10px",
                  borderRadius: 7,
                }}
              >
                <div>
                  <Input style={{ width: 200 }} onChange={handleChange} />
                  <List
                    bordered
                    pagination={{ pageSize: 5, position: "top" }}
                    dataSource={data.filter(({ name }) =>
                      name.toLowerCase().includes(inputFilter.toLowerCase())
                    )}
                    renderItem={(office) => (
                      <List.Item style={{ marginBottom: 10 }}>
                        <Typography.Text mark></Typography.Text> {office.name}{" "}
                        <Popconfirm
                          title="Do you want to delete this office?"
                          onConfirm={() => deleteFunc(office.id)}
                          okText="Yes"
                          cancelText="No"
                          className="deleteButton"
                          shape="round"
                          placement="topRight"
                          icon={
                            <QuestionCircleOutlined style={{ color: "red" }} />
                          }
                        >
                          <Button
                            type="primary"
                            danger
                            style={{
                              border: "0",
                              borderRadius: "5px",
                              boxShadow: " 0px 3px 6px #2C28281C",
                            }}
                          >
                            Delete
                          </Button>
                        </Popconfirm>
                        <Button
                          type="primary"
                          className="editButton"
                          onClick={() => {
                            window.location =
                              "edit/" + office.name + "/" + office.id;
                          }}
                        >
                          Edit
                        </Button>
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
  );
};

export default Offices;
