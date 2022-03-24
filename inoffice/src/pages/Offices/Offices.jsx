import { Component } from "react/cjs/react.production.min";
import Sidebar from "../../components/Sidebar/Sidebar";
import api from "../../helper/api";
import Layout, { Content, Footer } from "antd/lib/layout/layout";
import UserHeade from "../../components/Head/UserHead";
import { Button, Typography, List } from "antd";
import AddOfficeContainer from "./AddOfficeContainer";
import { Popconfirm } from "antd";


var data = [];

class Offices extends Component {
  state = {};

  componentDidMount() {
    api
      .get("admin/offices")
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
  deleteFunc = (value) =>{    
    api.delete("admin/office/" + value).then(() => {
      api.get("admin/offices").then((res) => {
        this.setState({
          data: res.data,
        });
      });
    });
  }
  render() {
    const addOfficeText = "Add office";
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
              addOfficeText={addOfficeText}
              onSubmit={onSubmit}
            />

            <List
              bordered
              dataSource={this.state.data}
              renderItem={(office) => (
                <List.Item>
                  <Typography.Text mark></Typography.Text> {office.name}{" "}
                      <Popconfirm
                        title="Are you sure to delete this office?"
                        onConfirm={() => this.deleteFunc(office.id)}
                        okText="Yes"
                        cancelText="No"
                        className="deleteButton"
                        shape="round"
                        placement="topRight"
                        >
                        <Button> Delete</Button>
                      </Popconfirm>
                  <Button
                    className="editButton"
                    shape="round"
                    onClick={() => {
                      window.location = "edit/" + office.name + "/" + office.id;
                    }}
                  >
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
