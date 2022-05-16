import { Component } from "react/cjs/react.production.min";
import Sidebar from "../../components/Sidebar/Sidebar";
import api from "../../helper/api";
import Layout, { Content, Footer } from "antd/lib/layout/layout";
import UserHeade from "../../components/Head/UserHead";
import { Button, Typography, List, Card } from "antd";
import AddOfficeContainer from "./AddOfficeContainer";
import { Popconfirm, Row, Col, notification } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

import "../Offices/Offices.css";

var data = [];

class Offices extends Component {
  state = {};

  openNotification = (placement) => {
    notification.info({
      message: `Notification`,
      description: " You succesfully deleted the office",
      duration: 2,
      placement,
    });
  };

  componentDidMount() {
    api
      .get("admin/offices")
      .then((res) => {
        this.setState({
          data: res.data,
        });
      })
      .catch((error) => {
        this.setState({
          user: error,
        });
      });
  }
  deleteFunc = (value) => {
    api.delete("admin/office/" + value).then(() => {
      api.get("admin/offices").then((res) => {
        this.setState({
          data: res.data,
        });
      });
    });
  };
  render() {
    const addOfficeText = "Add office";
    const onSubmit = (event) => {
      event.preventDefault(event);
    };
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
              align="middle"
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                margin: 30,
                marginRight: 100,
              }}
            >
              <Col className="addOfficeSectionButton" span={2}>
                <AddOfficeContainer
                  id="addOffice"
                  addOfficeText={addOfficeText}
                  onSubmit={onSubmit}
                />
              </Col>
            </Row>
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
                  title="Offices"
                  style={{
                    boxShadow: "0 2px 2px 1px #2c28283c",
                    padding: "10px",
                    borderRadius: 7,
                  }}
                >
                  <List
                    bordered
                    dataSource={this.state.data}
                    renderItem={(office) => (
                      <List.Item style={{ marginBottom: 10 }}>
                        <Typography.Text mark></Typography.Text> {office.name}{" "}
                        <Popconfirm
                          title="Do you want to delete this office?"
                          onConfirm={() => this.deleteFunc(office.id)}
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
                              background: "#f53c56",
                              color: "white",
                              border: "0",
                              borderRadius: "5px",
                              boxShadow: " 0px 3px 6px #2C28281C",
                            }}
                          >
                            {" "}
                            Delete
                          </Button>
                        </Popconfirm>
                        <Button
                          type="primary"
                          className="editButton"
                          style={{
                            background: "#2dce98",
                            color: "white",
                            border: "0",
                            borderRadius: "5px",
                            boxShadow: " 0px 3px 6px #2C28281C",
                          }}
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
                </Card>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default Offices;
