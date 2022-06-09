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
  Table,
} from "antd";
import api from "../../helper/api";
import UploadOfficePlan from "./UploadOfficePlan";
import { withRouter } from "../../helper/withRouterHelper";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../../components/Loading/Loading";

const OfficeDetails = ({ props }) => {
  const [officeName, setOfficeName] = useState(props.params.name);
  const [officeId, setOfficeId] = useState(props.params.id);
  const [desks, setDesks] = useState([]);
  const [checked, setChecked] = useState([]);
  const [unchecked, setUnchecked] = useState([]);
  const [initialDesks, setInitialDesks] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [conferenceRooms, setConference] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getDesks = () => {
    api
      .get("admin/office-desks/" + officeId)
      .then((res) => {
        setDesks(res.data.deskList);

        const check = res.data.deskList.map((x) => x.id);
        setUnchecked(check);
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

  const save = () => {
    let flag = false;
    const properlySortedData = desks.map((item) => {
      const desk = {
        deskId: item.id,
        unavailable: item.categories?.unavailable ? true : false,
        singleMonitor: item.categories?.singleMonitor ? true : false,
        dualMonitor: item.categories?.dualMonitor ? true : false,
        nearWindow: item.categories?.nearWindow ? true : false,
      };
      if (desk.singleMonitor && desk.dualMonitor) {
        flag = true;
      }
      return desk;
    });

    const data = {
      listOfDesksToUpdate: [...properlySortedData],
    };

    console.log(data);
    if (flag) {
      notification.open({
        message: "Notification",
        placement: "top",
        description:
          "You cannot have both a single monitor and dual monitor desk.",
        duration: 3,
      });
      return;
    }

    api
      .put("admin/office-entities", data)
      .then((res) => {
        getDesks();
        openNotification("top");
        notification.open({
          message: "Notification",
          placement: "top",
          description: "Entities updated",
          duration: 3,
        });
      })
      .catch((error) => {
        console.log(error.response);
        notification.open({
          message: "Notification",
          placement: "top",
          description: "It seems there was an error while saving",
          duration: 3,
        });
      });
  };

  const check = (id, category) => {
    const newItem = desks.map((item) => {
      if (item.id === id) {
        if (category === "unavailable") {
          return {
            ...item,
            categories: {
              ...item.categories,
              unavailable: !item.categories?.unavailable ? true : false,
            },
          };
        } else if (category === "singleMonitor") {
          return {
            ...item,
            categories: {
              ...item.categories,
              singleMonitor: !item.categories?.singleMonitor ? true : false,
            },
          };
        } else if (category === "dualMonitor") {
          return {
            ...item,
            categories: {
              ...item.categories,
              dualMonitor: !item.categories?.dualMonitor ? true : false,
            },
          };
        } else if (category === "nearWindow") {
          return {
            ...item,
            categories: {
              ...item.categories,
              nearWindow: !item.categories?.nearWindow ? true : false,
            },
          };
        }
      }
      return item;
    });

    setDesks(newItem);

    // const newChecked = [...checked, checkedValues.target.value];
    // setChecked(newChecked);
    // const newUnchecked = unchecked.filter((item) => {
    //   let flag = false;
    //   newChecked.forEach((id) => {
    //     if (id === item) flag = true;
    //   });
    //   return flag ? false : true;
    // });
    // setUnchecked(newUnchecked);
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

  const columns = [
    {
      title: "All desks",
      dataIndex: "indexForOffice",
      key: 1,
      align: "center",
      width: "16.6666666667%",
    },
    {
      title: "Unavailable desks",
      dataIndex: "unavailable",
      key: 2,

      render: (text, item, index) => {
        return (
          <Checkbox
            style={{
              background: "white",
              color: "black",
              paddingLeft: "3%",
            }}
            checked={item.categories?.unavailable}
            onChange={() => check(item.id, "unavailable")}
          ></Checkbox>
        );
      },
      align: "center",
      width: "16.6666666667%",
    },
    {
      title: "Single monitor",
      dataIndex: "singleMonitor",
      key: 3,

      render: (text, item, index) => {
        return (
          <Checkbox
            style={{
              background: "white",
              color: "black",
              paddingLeft: "3%",
            }}
            checked={item.categories?.singleMonitor}
            onChange={() => check(item.id, "singleMonitor")}
          ></Checkbox>
        );
      },
      align: "center",
      width: "16.6666666667%",
    },
    {
      title: "Dual monitor",
      dataIndex: "dualMonitor",
      key: 4,

      render: (text, item, index) => {
        return (
          <Checkbox
            style={{
              background: "white",
              color: "black",
              paddingLeft: "3%",
            }}
            checked={item.categories?.dualMonitor}
            onChange={() => check(item.id, "dualMonitor")}
          ></Checkbox>
        );
      },
      align: "center",
      width: "16.6666666667%",
    },
    {
      title: "Near window",
      dataIndex: "nearWindow",
      key: 5,

      render: (text, item, index) => {
        return (
          <Checkbox
            style={{
              background: "white",
              color: "black",
              paddingLeft: "3%",
            }}
            checked={item.categories?.nearWindow}
            onChange={() => check(item.id, "nearWindow")}
          ></Checkbox>
        );
      },
      align: "center",
      width: "16.6666666667%",
    },
    {
      title: "Delete",
      dataIndex: "delete",
      align: "center",
      key: 6,
      borderRight: "none",
      render: (text, item, id) => {
        return (
          <Popconfirm
            title="Are you sure to delete this desk?"
            onConfirm={() => deleteNotification([item.id, "D"])}
            okText="Yes"
            cancelText="No"
            shape="round"
            style={{ padding: 0 }}
            placement="topRight"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <DeleteFilled
              className="deleteiconDesks"
              key={item.id}
              value={item.id}
              style={{ padding: 0 }}
            />
          </Popconfirm>
        );
      },
      width: "16.6666666667%",
    },
  ];

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "90%" }}>
        <div style={{ marginBottom: 20 }}>
          <div>
            <h2
              style={{
                color: "white",
              }}
            >
              Edit office
            </h2>
            <div className="officeTitels">
              Name: <span className="labels">{officeName}</span>
            </div>
          </div>
          <div>
            <UploadOfficePlan
              className="uploadOfficePlanButton"
              triggerText="Update office plan/information"
              imageUrl={imageUrl}
            />
          </div>
        </div>
        <div>
          <Form
            style={{
              display: "flex",
              width: 600,
              justifyContent: "flex-start",
            }}
            onFinish={handleSubmit}
          >
            <Form.Item name="numberOfDesks">
              <Input
                style={{ width: 250 }}
                placeholder="Enter number of desks"
                type="number"
              />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="uploadOfficePlan btn"
              block
              style={{ width: 150, marginLeft: 5 }}
            >
              Add new entities
            </Button>
          </Form>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "55%" }}>
            <div
              id="scrollableDiv"
              style={{
                height: 400,
                overflow: "auto",
                padding: "0 16px",
                background: "white",
                width: "100%",
                marginBottom: 20,
              }}
            >
              {isLoading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
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
                  <Table
                    bordered
                    style={{ width: "100%", border: "none" }}
                    className="newTable"
                    dataSource={desks}
                    columns={columns}
                    pagination={false}
                  />
                </InfiniteScroll>
              )}
            </div>
            <Button
              type="primary"
              className="uploadOfficePlan btn"
              onClick={save}
              block
              style={{ width: 150, marginLeft: 5 }}
            >
              Update entities
            </Button>
          </div>
          <div style={{ background: "white", height: 400 }}>
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
      </div>
    </div>
  );
};

export default OfficeDetails;
