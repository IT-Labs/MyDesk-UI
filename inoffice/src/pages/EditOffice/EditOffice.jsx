import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import { withRouter } from "../../helper/withRouterHelper";
import OfficeDetails from "./OfficeDetails";
import MainLayout from "../../layouts/MainLayout";

const EditOffice = (props) => {
  return (
    <Layout>
      <Sidebar selected="2" />
      <MainLayout isDashboard={true}>
        <Content>
          <OfficeDetails props={props} />
        </Content>
      </MainLayout>
    </Layout>
  );
};

export default withRouter(EditOffice);
