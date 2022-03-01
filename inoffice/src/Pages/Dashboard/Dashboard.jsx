import { Component } from "react/cjs/react.production.min";
import Sidebar from "../../components/Sidebar/Sidebar";
import axios from "axios";
import Layout, { Content, Footer } from "antd/lib/layout/layout";
import UserHeade from "../../components/Head/UserHead";

class Dashboard extends Component {
  state = {};
  componentDidMount() {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };
    axios.get("admin/dashboard", config).then(
      (res) => {
        console.log(res);
        this.setState({
          user: res.data,
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }
  render() {
    if (this.state.user) {
      return (
        <Layout>
          <UserHeade />
          <Layout>
            <Sidebar selected="1" />
            {/* <Sider>LEFT</Sider> */}
            <Content>Dashboard</Content>
            <Footer>
              <p>Footer</p>
            </Footer>
          </Layout>
        </Layout>
      );
    }
    return <h1 style={{ color: "white" }}>Must be logged in as admin!</h1>;
  }
}

export default Dashboard;
