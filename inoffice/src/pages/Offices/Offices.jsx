import { Component } from "react/cjs/react.production.min";
import Sidebar from "../../components/Sidebar/Sidebar";
import api from "../../helper/api";
import Layout, { Content, Footer } from "antd/lib/layout/layout";
import UserHeade from "../../components/Head/UserHead";
import { Button, Typography, List } from "antd";
import AddOfficeContainer from "./AddOfficeContainer";
import { Popconfirm, Row, Col, notification } from "antd";
import "../Offices/Offices.css";

var data = [];

class Offices extends Component {
  state = {};

  openNotification = (placement) => {
    notification.info({
      message: `Notification`,
      description: " You succesfully deleted the office",
      duration: 1,
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
          <Content>
            <Row align="middle">
              <Col span={21}>
                <h1>Offices</h1>
              </Col>
              <Col className="addOfficeSectionButton" span={2}>
                <AddOfficeContainer
                  id="addOffice"
                  addOfficeText={addOfficeText}
                  onSubmit={onSubmit}
                />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <List
                  bordered
                  dataSource={this.state.data}
                  renderItem={(office) => (
                    <List.Item>
                      <Typography.Text mark></Typography.Text> {office.name}{" "}
                      <Popconfirm
                        title="Are you sure to delete this office?"
                        onConfirm={() => this.deleteFunc(office.id)}
                        okText="Yes"
                        cancelText="No"
                        className="deleteButton"
                        shape="round"
                        placement="topRight"
                      >
                        <Button type="primary" danger>
                          {" "}
                          Delete
                        </Button>
                      </Popconfirm>
                      <Button
                        type="primary"
                        className="editButton"
                        shape="round"
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
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default Offices;
