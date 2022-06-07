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
  console.log(props);
  const [isLoading, setIsLoading] = useState(true);

  const getDesks = () => {
    api
      .get("admin/office-desks/" + officeId)
      .then((res) => {
        setDesks(res.data.deskList);
        console.log(res.data);
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

  const checkCategory = (e) => {
    if (e.categories === "silent") {
      return true;
    } else {
      return false;
    }
  };

  const save = () => {
    const data = {
      checkedDesks: checked,
      uncheckedDesks: unchecked,
    };

    console.log(data);

    api
      .put("admin/office-entities", data)
      .then((res) => {
        getDesks();
        openNotification("top");
      })
      .catch((error) =>
        notification.open({
          message: "Notification",
          placement: "top",
          description: "It seems there was an error while saving",
        })
      );
  };

  const check = (checkedValues) => {
    const newChecked = [...checked, checkedValues.target.value];
    setChecked(newChecked);
    const newUnchecked = unchecked.filter((item) => {
      let flag = false;
      newChecked.forEach((id) => {
        if (id === item) flag = true;
      });
      return flag ? false : true;
    });
    setUnchecked(newUnchecked);
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

  const columns = [
    {
      title: "All desks",
      dataIndex: "indexForOffice",
      key: 1,
      align: "center",
      width: "25%",
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
            value={item.id}
            defaultChecked={checkCategory(item)}
            onChange={check}
          ></Checkbox>
        );
      },
      align: "center",
      width: "50%",
    },
    {
      title: "Delete",
      dataIndex: "delete",
      align: "center",
      borderRight: "none",
      width: "25%",
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
          <div style={{ width: "40%" }}>
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
