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
import OfficeDetails from "./OfficeDetails";

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
          <OfficeDetails props={props} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default withRouter(EditOffice);
