import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import { withRouter } from "../../helper/withRouterHelper";
import OfficeDetails from "./OfficeDetails";
import MainLayout from "../../layouts/MainLayout";

const EditOffice = (props) => {
  const media = window.matchMedia("(max-width: 820px)");
  return (
    <Layout>
      <div>{!media.matches && <Sidebar selected="2" />}</div>
      <MainLayout isDashboard={true}>
        <Content>
          <OfficeDetails props={props} />
        </Content>
      </MainLayout>
    </Layout>
  );
};

export default withRouter(EditOffice);
