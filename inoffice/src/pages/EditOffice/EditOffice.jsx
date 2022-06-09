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
