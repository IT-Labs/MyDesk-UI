import { Component } from "react/cjs/react.production.min";
import Sidebar from "../../components/Sidebar/Sidebar";
import api from "../../helper/api";
import Layout, { Content, Footer } from "antd/lib/layout/layout";
import UserHeade from "../../components/Head/UserHead";
import { Button, Typography, List } from "antd";
import "./Offices.css";
import AddOfficeContainer from "./AddOfficeContainer";

var data = [];

class Offices extends Component {
  state = {};

  componentDidMount() {
    api
      .get("admin/getalloffices")
      .then((res) => {
        this.setState({
          data: res.data,
        });
      })
      .catch((error) => {
        this.setState({
          user: error,
        });
      });
  }
  render() {
    const triggerText = "Add office";
    const onSubmit = (event) => {
      event.preventDefault(event);
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
              dataSource={this.state.data}
              renderItem={(item) => (
                <List.Item>
                  <Typography.Text mark></Typography.Text> {item.name}{" "}
                  <Button
                    onClick={() => {
                      api.get("admin/delete/" + item.id).then(() => {
                        api.get("admin/getalloffices").then((res) => {
                          this.setState({
                            data: res.data,
                          });
                        });
                        //window.location = "offices";
                      });
                    }}
                    className="deleteButton"
                    shape="round"
                  >
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
}

export default Offices;
