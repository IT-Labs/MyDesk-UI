import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import UserHeade from "../../components/Head/UserHead";
import "../EditOffice/editoffice.css";

import { withRouter } from "../../helper/withRouterHelper";

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
