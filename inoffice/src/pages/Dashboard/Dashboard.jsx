import { Component } from "react/cjs/react.production.min";
import Sidebar from "../../components/Sidebar/Sidebar";
import Layout, { Content, Footer } from "antd/lib/layout/layout";
import UserHeade from "../../components/Head/UserHead";

class Dashboard extends Component {
  render() {
    return (
      <Layout>
        <UserHeade />
        <Layout>
          <Sidebar selected="1" />
          <Content>Dashboard</Content>
          <Footer>
            <p>Footer</p>
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default Dashboard;
