import React, { Component, useEffect, useState } from "react";
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
import Loading from "../../components/Loading/Loading";

const EditOffice = (props) => {
  const [officeName, setOfficeName] = useState(props.params.name);
  const [officeId, setOfficeId] = useState(props.params.id);
  const [desks, setDesks] = useState([]);
  const [checked, setChecked] = useState([]);
  const [initialDesks, setInitialDesks] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [conferenceRooms, setConference] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getDesks = () => {
    api
      .get("admin/office-desks/" + officeId)
      .then((res) => {
        console.log(res.data.deskList);
        setDesks(res.data.deskList);
        const check = res.data.deskList.map((x) => x.id);
        setChecked(check);
        const init = res.data.deskList.map((x) => x.id);
        setInitialDesks(init);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        notification.open({
          message: `Notification`,
          description: "There was an error while loading",
          duration: 2,
          placement: "top",
        });
      });
  };

  const getImage = () => {
    api
      .get("admin/office/image/" + officeId)
      .then((res) => {
        setImageUrl(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getDesks();
    getImage();
  }, []);

  const checkCategory = (e) => {
    if (e.categories === "silent") {
      return true;
    } else {
      return false;
    }
  };

  const save = () => {
    const officeCapacityData = conferenceRooms.map((item) => ({
      confId: item.id,
      confCap: item.capacity,
    }));

    const data = {
      checkedDesks: checked,
      conferenceRoomCapacity: officeCapacityData,
      uncheckedDesks: initialDesks.filter((x) => checked.includes(x)),
    };

    api
      .put("admin/office-entities", data)
      .then((res) => {
        getDesks();
        openNotification("top");
      })
      .catch((error) => console.log(error));
  };

  const check = (checkedValues) => {
    let newCheckedArrayState = checked ? checked : [];
    newCheckedArrayState = checkedValues.target.checked
      ? [...newCheckedArrayState, checkedValues.target.value]
      : newCheckedArrayState.filter((x) => x != checkedValues.target.value);

    setChecked(newCheckedArrayState);
  };

  const openNotification = (placement) => {
    notification.info({
      message: `Notification`,
      description: " You succesfully updated the entities",
      duration: 1,
      placement,
    });
  };

  const handleSubmit = (e) => {
    console.log(e);
    const data = {
      numberOfDesks: e.numberOfDesks,
    };

    api
      .post("admin/office-entities/" + officeId, data)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteNotification = (target) => {
    const data = {
      idOfEntity: target[0],
      typeOfEntity: target[1],
    };

    api
      .delete("admin/entity/", { data: data })
      .then((response) => {
        getDesks();
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

  return (
    <Layout>
      <UserHeade />
      <Layout>
        <Sidebar selected="2" />
        <Content>
          <Form name="normal_login" onFinish={handleSubmit}>
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
                              {officeName.split(" ")[0]}
                            </span>
                          </div>
                        </div>
                        <div className="officeTitels">
                          Location:{" "}
                          <span className="labels">
                            {officeName.split(" ")[1]}
                          </span>
                        </div>
                      </div>
                    </Row>
                    <Row>
                      <UploadOfficePlan
                        className="uploadOfficePlanButton"
                        triggerText="Update office plan/information"
                        imageUrl={imageUrl}
                      />
                    </Row>
                  </div>
                </Col>
                <Col span={2}></Col>

                <Row align="top">
                  <Col span={10}>
                    <div></div>
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
              <Col
                // span={5}
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  width: "100%",
                  position: "relative",
                  left: 65,
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
                  onClick={save}
                  block
                  style={{ width: 150, margin: 5 }}
                >
                  Update entities
                </Button>
              </Col>
            </Row>
          </Form>
          <Row
            style={{
              display: "flex",
              justifyContent: "center",
              width: "90%",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "90%",
              }}
            >
              <div
                id="scrollableDiv"
                style={{
                  height: 400,
                  overflow: "auto",
                  padding: "0 16px",
                  background: "white",
                  width: "40%",
                }}
                offset={1}
              >
                {isLoading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      height: 400,
                      overflow: "hidden",
                    }}
                  >
                    <Loading />
                  </div>
                ) : (
                  <InfiniteScroll
                    dataLength={30}
                    scrollableTarget="scrollableDiv"
                    style={{
                      border: "1px solid transparent",
                      minWidth: "100%",
                    }}
                  >
                    <List
                      header={
                        <div className="divSpan">
                          <span className="firstSpan">All desks</span>
                          <span className="secondSpan">Unavaiable Desk</span>
                          <span> Delete</span>
                        </div>
                      }
                      bordered
                      style={{ width: "100%", border: "none" }}
                      dataSource={desks}
                      renderItem={(item) => (
                        <List.Item>
                          {console.log(item)}
                          <Col span={4}>{item.indexForOffice}</Col>
                          <Col span={3}>
                            <Checkbox
                              style={{
                                background: "white",
                                color: "black",
                                paddingLeft: "3%",
                              }}
                              value={item.id}
                              defaultChecked={checkCategory(item)}
                              onChange={check}
                            ></Checkbox>
                          </Col>

                          <Col span={2}>
                            <Popconfirm
                              title="Are you sure to delete this desk?"
                              onConfirm={() =>
                                deleteNotification([item.id, "D"])
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
                )}
              </div>

              <div style={{ width: 400 }}>
                {imageUrl ? (
                  <Image src={imageUrl} className="officeImagePlan"></Image>
                ) : (
                  <Image
                    className="officeImagePlan"
                    src="https://i.postimg.cc/MpM7bn2J/Screenshot-5.png"
                  ></Image>
                )}
              </div>
            </div>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default withRouter(EditOffice);
