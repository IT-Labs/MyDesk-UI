import React, { Component } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import UserHeade from "../../components/Head/UserHead";
import "../EditOffice/editoffice.css";
import {
  Checkbox,
  Form,
  Input,
  Button,
  List,
  Row,
  Col,
  notification,
  Space,
} from "antd";
import api from "../../helper/api";
import UploadOfficePlan from "./UploadOfficePlan";
import { withRouter } from "../../helper/withRouterHelper";
import InfiniteScroll from "react-infinite-scroll-component";

class EditOffice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      officeName: this.props.params.name,
      officeId: this.props.params.id,
    };
  }

  getDesks = () => {
    api
      .get("admin/office-desks/" + this.state.officeId)
      .then((res) => {
        this.setState({
          desks: res.data,
          checked: res.data
            .filter((x) => x.categories == "silent")
            .map((x) => x.id),
          initialdesks: res.data
            .filter((x) => x.categories == "silent")
            .map((x) => x.id),
        });
      })
      .catch((error) => {
        this.setState({
          user: error,
        });
      });
  };

  getConferenceRooms = () => {
    api
      .get("admin/office-conferencerooms/" + this.state.officeId)
      .then((res) => {
        this.setState({
          conferenceRooms: res.data,
        });
      })
      .catch((error) => {
        this.setState({
          user: error,
        });
      });
  };

  getImage = () => {
    api
      .get("admin/office/image/" + this.state.officeId)
      .then((res) => {
        this.setState({
          imageUrl: res.data,
        });
      })
      .catch((error) => {
        this.setState({
          user: error,
        });
      });
  };

  componentDidMount() {
    this.getDesks();
    this.getConferenceRooms();
    this.getImage();
  }

  capacityChange = (name, value) => {
    var items = this.state.conferenceRooms;

    for (let i = 0; i < items.length; i++) {
      if (items[i].id == name) {
        items[i].capacity = parseInt(value);
      }
    }
  };

  checkCategory = (e) => {
    if (e.categories == "silent") {
      return true;
    } else {
      return false;
    }
  };

  save = () => {
    const officeCapacityData = this.state.conferenceRooms.map((item) => ({
      confId: item.id,
      confCap: item.capacity,
    }));

    const data = {
      checkedDesks: this.state.checked,
      conferenceRoomCapacity: officeCapacityData,
      uncheckedDesks: this.state.initialdesks.filter(
        (x) => !this.state.checked.includes(x)
      ),
    };

    api
      .put("admin/office-entities", data)
      .then((res) => {
        this.getDesks();
        this.getConferenceRooms();
        this.openNotification("top");
      })
      .catch((error) =>
        this.setState({
          user: error,
        })
      );
  };

  checked = (checkedValues) => {
    let newCheckedArrayState = this.state.checked ? this.state.checked : [];
    newCheckedArrayState = checkedValues.target.checked
      ? [...newCheckedArrayState, checkedValues.target.value]
      : newCheckedArrayState.filter((x) => x != checkedValues.target.value);

    this.setState({
      checked: newCheckedArrayState,
    });
  };

  openNotification = (placement) => {
    notification.info({
      message: `Notification`,
      description: " You succesfully updated the entities",
      placement,
    });
  };

  handleSubmit = (e) => {
    const data = {
      numberOfDesks: e.numberOfDesks,
      numberOfConferenceRooms: e.numberOfConferenceRooms,
    };

    api
      .post("admin/office-entities/" + this.state.officeId, data)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        this.setState({
          error: "invalid credentials",
        });
      });
  };
  render() {
    return (
      <Layout>
        <UserHeade />
        <Layout>
          <Sidebar selected="2" />
          <Content>
            <Space>
              <Row>
                <Col span={24}>
                  <div></div>
                </Col>
              </Row>
            </Space>
            <Row align="middle">
              <Col span={1}></Col>
              <Col className="editOffice" span={23}>
                <div>Edit office</div>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={1}></Col>
              <Col className="officeBranch" span={23}>
                <div>Office information:</div>
              </Col>
            </Row>
            <Form name="normal_login" onFinish={this.handleSubmit}>
              <Row align="bottom">
                <Col span={1}></Col>
                <Col span={8} className="officeName">
                  <div className="inlineBlockDiv">
                    <div>
                      <div className="officeTitels">
                        Office name:{" "}
                        <span className="labels">
                          {this.state.officeName.split(" ")[0]}
                        </span>
                      </div>
                    </div>
                    <div className="officeTitels">
                      Office location:{" "}
                      <span className="labels">
                        {this.state.officeName.split(" ")[1]}
                      </span>
                    </div>
                  </div>
                </Col>
                <Col span={15}>
                  <UploadOfficePlan
                    className="uploadOfficePlanButton"
                    id="addOffice"
                    triggerText="Update Office Plan / Information"
                    imageUrl={this.state.imageUrl}
                  />
                </Col>
              </Row>
              <Space>
                <Row>
                  <Col span={24}>
                    <div></div>
                  </Col>
                </Row>
              </Space>
              <Row className="imageRow">
                <Col span={6}></Col>
                <Col span={6}>
                  <div>
                    {this.state.imageUrl ? (
                      <img
                        className="officeImagePlan"
                        src={this.state.imageUrl}
                      ></img>
                    ) : (
                      <img
                        className="officeImagePlan"
                        src="https://i.postimg.cc/9QzYV5q9/Screenshot-3.png"
                      ></img>
                    )}
                  </div>
                </Col>
                <Col span={12}></Col>
              </Row>
              <Space>
                <Row>
                  <Col span={24}>
                    <div></div>
                  </Col>
                </Row>
              </Space>
              <Row>
                <Col span={1}></Col>
                <Col span={4} className="officeName">
                  <label className="officeName">Number of desks:</label>
                </Col>
                <Col span={8}></Col>
                <Col span={4}>
                  <label className="officeName">
                    Number of conference rooms:
                  </label>
                </Col>
              </Row>
              <Row align="top">
                <Col span={1}></Col>
                <Col span={4} className="officeName">
                  <Form.Item name="numberOfDesks">
                    <Input placeholder="Enter desk number" />
                  </Form.Item>
                </Col>
                <Col span={8}></Col>
                <Col span={4}>
                  <Form.Item name="numberOfConferenceRooms">
                    <Input placeholder="Enter conference rooms number" />
                  </Form.Item>{" "}
                </Col>
                <Col span={2}></Col>
                <Col offset={2} span={2}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="uploadOfficePlan"
                    shape="round"
                  >
                    Add new entities
                  </Button>
                </Col>
                <Col span={1}></Col>
              </Row>
            </Form>
            <Row>
              <Col
                id="scrollableDiv"
                style={{
                  height: 400,
                  overflow: "auto",
                  padding: "0 16px",
                  border: "1px solid rgba(140, 140, 140, 0.35)",
                }}
                offset={1}
                span={10}
              >
                <InfiniteScroll
                  dataLength={30}
                  scrollableTarget="scrollableDiv"
                >
                  <List
                    header={
                      <div className="divSpan">
                        <span className="firstSpan">All desks</span>
                        <span className="secondSpan">Silent desk</span>
                      </div>
                    }
                    className="list"
                    bordered
                    dataSource={this.state.desks}
                    renderItem={(item, index) => (
                      <List.Item>
                        {index + 1}
                        <Checkbox
                          style={{
                            background: "white",
                            color: "black",
                          }}
                          value={item.id}
                          defaultChecked={this.checkCategory(item)}
                          onChange={this.checked}
                        ></Checkbox>
                      </List.Item>
                    )}
                  />
                </InfiniteScroll>
              </Col>
              <Col
                id="scrollableDiv"
                style={{
                  height: 400,
                  marginBottom: 10,
                  overflow: "auto",
                  padding: "0 16px",
                  border: "1px solid rgba(140, 140, 140, 0.35)",
                }}
                offset={2}
                span={10}
              >
                <List
                  header={
                    <div className="divSpan">
                      <span className="firstSpan">All Conference Rooms</span>
                      <span className="secondSpan">Capacity</span>
                    </div>
                  }
                  className="list"
                  bordered
                  dataSource={this.state.conferenceRooms}
                  renderItem={(item, index) => (
                    <List.Item>
                      <Col span={4}>{index + 1}</Col>
                      <Col span={4}>
                        <Form.Item name={item.id}>
                          <Input
                            size="small"
                            name={item.id}
                            onChange={(e) =>
                              this.capacityChange(e.target.name, e.target.value)
                            }
                            defaultValue={item.capacity}
                            placeholder="Capacity"
                          />
                        </Form.Item>
                      </Col>
                    </List.Item>
                  )}
                />
              </Col>
            </Row>
            <Space>
              <Row>
                <Col span={24}>
                  <div></div>
                </Col>
              </Row>
            </Space>
            <Row>
              <Col span={1}></Col>
              <Col span={18}></Col>
              <Col offset={2} span={2}>
                <Button
                  type="primary"
                  className="uploadOfficePlan"
                  shape="round"
                  onClick={this.save}
                >
                  Update Entities
                </Button>
              </Col>
              <Col span={1}></Col>
            </Row>
            <Space>
              <Row>
                <Col span={24}>
                  <div></div>
                </Col>
              </Row>
            </Space>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
export default withRouter(EditOffice);
