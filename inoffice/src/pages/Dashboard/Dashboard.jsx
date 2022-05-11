import { Component } from "react/cjs/react.production.min";
import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content } from "antd/lib/layout/layout";
import UserHead from "../../components/Head/UserHead";

class Dashboard extends Component {
  render() {
    return (
      <Layout>
        <UserHead />
        <Layout className="panelBg">
          <Sidebar selected="1" />
          <Content>Dashboard</Content>
        </Layout>
      </Layout>
    );
  }
}

export default Dashboard;
