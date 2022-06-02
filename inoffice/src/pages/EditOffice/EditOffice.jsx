import React, { Component } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import UserHeade from "../../components/Head/UserHead";
import "../EditOffice/editoffice.css";
import { DeleteFilled } from "@ant-design/icons";
import { QuestionCircleOutlined } from "@ant-design/icons";
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
  Image,
  Popconfirm,
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
            .filter((x) => x.categories === "silent")
            .map((x) => x.id),
          initialdesks: res.data
            .filter((x) => x.categories === "silent")
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
      if (items[i].id === name) {
        items[i].capacity = parseInt(value);
      }
    }
  };

  checkCategory = (e) => {
    if (e.categories === "silent") {
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
      duration: 1,
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

  deleteNotification = (target) => {
    const data = {
      idOfEntity: target[0],
      typeOfEntity: target[1],
    };

    api
      .delete("admin/entity/", { data: data })
      .then((response) => {
        this.getDesks();
        this.getConferenceRooms();
        notification.open({
          message: "Notification",
          description: "You successfully deleted the entity",
          placement: "top",
          duration: 2,
        });
      })
      .catch((error) => {
        console.error("Error message");
      });
  };

  render() {
    return (
      <Layout>
        <UserHeade />
        <Layout>
          <Sidebar selected="2" />
          <Content>
            <Form name="normal_login" onFinish={this.handleSubmit}>
              <Row
                align="top"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignContent: "center",
                    width: "80%",
                  }}
                >
                  <Col span={10} className="officeName">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        left: "-50px",
                      }}
                    >
                      <Row>
                        <div className="inlineBlockDiv">
                          <div>
                            <h3 className="editOffice">Edit office</h3>
                            <div className="officeTitels">
                              Name:{" "}
                              <span className="labels">
                                {this.state.officeName.split(" ")[0]}
                              </span>
                            </div>
                          </div>
                          <div className="officeTitels">
                            Location:{" "}
                            <span className="labels">
                              {this.state.officeName.split(" ")[1]}
                            </span>
                          </div>
                        </div>
                      </Row>
                      <Row>
                        <UploadOfficePlan
                          className="uploadOfficePlanButton"
                          triggerText="Update office plan/information"
                          imageUrl={this.state.imageUrl}
                        />
                      </Row>
                    </div>
                  </Col>
                  <Col span={2}></Col>

                  <Row align="top">
                    <Col span={10}>
                      <div>
                        {this.state.imageUrl ? (
                          <Image
                            src={this.state.imageUrl}
                            className="officeImagePlan"
                          ></Image>
                        ) : (
                          <Image
                            className="officeImagePlan"
                            src="https://i.postimg.cc/MpM7bn2J/Screenshot-5.png"
                          ></Image>
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>
              </Row>

              <Row>
                <Col span={1}></Col>
                <Col span={4} className="officeName">
                  <label className="officeName">Number of desks:</label>
                </Col>
              </Row>
              <Row align="top">
                <Col span={1}></Col>
                <Col
                  // span={5}
                  className="officeName"
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    marginLeft: 15,
                    width: "80%",
                  }}
                >
                  <Form.Item name="numberOfDesks">
                    <Input
                      style={{ width: 250, margin: 5 }}
                      placeholder="Enter number of desks"
                      type="number"
                    />
                  </Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="uploadOfficePlan btn"
                    block
                    style={{ width: 150, margin: 5 }}
                  >
                    Add new entities
                  </Button>
                  <Button
                    type="primary"
                    className="uploadOfficePlan btn"
                    onClick={this.save}
                    block
                    style={{ width: 150, margin: 5 }}
                  >
                    Update entities
                  </Button>
                </Col>
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
                        <span className="secondSpan">Unavaiable Desk</span>
                        <span> Delete</span>
                      </div>
                    }
                    className="list"
                    bordered
                    dataSource={this.state.desks}
                    renderItem={(item) => (
                      <List.Item>
                        <Col span={4}>{item.indexForOffice}</Col>
                        <Col span={3}>
                          <Checkbox
                            style={{
                              background: "white",
                              color: "black",
                              paddingLeft: "3%",
                            }}
                            value={item.id}
                            defaultChecked={this.checkCategory(item)}
                            onChange={this.checked}
                          ></Checkbox>
                        </Col>

                        <Col span={2}>
                          <Popconfirm
                            title="Are you sure to delete this desk?"
                            onConfirm={() =>
                              this.deleteNotification([item.id, "D"])
                            }
                            okText="Yes"
                            cancelText="No"
                            shape="round"
                            placement="topRight"
                            icon={
                              <QuestionCircleOutlined
                                style={{ color: "red" }}
                              />
                            }
                          >
                            <DeleteFilled
                              className="deleteiconDesks"
                              key={item.id}
                              value={item.id}
                            />
                          </Popconfirm>
                        </Col>
                      </List.Item>
                    )}
                  />
                </InfiniteScroll>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
export default withRouter(EditOffice);
