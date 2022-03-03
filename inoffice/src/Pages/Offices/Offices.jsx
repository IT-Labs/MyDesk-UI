import { Component } from "react/cjs/react.production.min";
import Sidebar from "../../components/Sidebar/Sidebar";
import axios from "axios";
import Layout, { Content, Footer } from "antd/lib/layout/layout";
import UserHeade from "../../components/Head/UserHead";
import { Button, Typography, List } from "antd";
import "./Offices.css";
import AddOfficeContainer from "./AddOfficeContainer";

const data = [
  "Racing car sprays burning fuel into crowd.",
  "Japanese princess to wed commoner.",
  "Australian walks 100km after outback crash.",
  "Man charged over missing wedding girl.",
  "Los Angeles battles huge wildfires.",
  "Los Angeles battles huge wildfires.",
  "Los Angeles battles huge wildfires.",
  "Los Angeles battles huge wildfires.",
  "Los Angeles battles huge wildfires.",
  "Los Angeles battles huge wildfires.",
  "Racing car sprays burning fuel into crowd.",
  "Japanese princess to wed commoner.",
  "Australian walks 100km after outback crash.",
  "Man charged over missing wedding girl.",
  "Los Angeles battles huge wildfires.",
  "Los Angeles battles huge wildfires.",
  "Los Angeles battles huge wildfires.",
  "Los Angeles battles huge wildfires.",
  "Los Angeles battles huge wildfires.",
  "Los Angeles battles huge wildfires.",
  "Racing car sprays burning fuel into crowd.",
  "Japanese princess to wed commoner.",
  "Australian walks 100km after outback crash.",
  "Man charged over missing wedding girl.",
  "Los Angeles battles huge wildfires.",
  "Los Angeles battles huge wildfires.",
  "Los Angeles battles huge wildfires.",
  "Los Angeles battles huge wildfires.",
  "Los Angeles battles huge wildfires.",
  "Los Angeles battles huge wildfires.",
  "Racing car sprays burning fuel into crowd.",
  "Japanese princess to wed commoner.",
  "Australian walks 100km after outback crash.",
  "Man charged over missing wedding girl.",
  "Los Angeles battles huge wildfires.",
  "Los Angeles battles huge wildfires.",
  "Los Angeles battles huge wildfires.",
  "Los Angeles battles huge wildfires.",
  "Los Angeles battles huge wildfires.",
  "Los Angeles battles huge wildfires.",
];

class Offices extends Component {
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
      const triggerText = "Add office";
      const onSubmit = (event) => {
        event.preventDefault(event);
        console.log(event.target.name.value);
        console.log(event.target.email.value);
      };
      return (
        <Layout>
          <UserHeade />
          <Layout>
            <Sidebar selected="2" />
            <Content>
              <h1>Offices</h1>

              <AddOfficeContainer
                id="addOffice"
                triggerText={triggerText}
                onSubmit={onSubmit}
              />

              <List
                bordered
                dataSource={data}
                renderItem={(item) => (
                  <List.Item>
                    <Typography.Text mark>[ITEM]</Typography.Text> {item}{" "}
                    <Button className="deleteButton" shape="round">
                      Delete
                    </Button>
                    <Button className="editButton" shape="round">
                      Edit
                    </Button>
                  </List.Item>
                )}
              />
            </Content>
          </Layout>
        </Layout>
      );
    }
    return <h1 style={{ color: "white" }}>Must be logged in as admin!</h1>;
  }
}

export default Offices;
