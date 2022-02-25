import { Component } from "react/cjs/react.production.min";
import Sidebar from "../../components/Sidebar/Sidebar";
import axios from "axios";
import jwt from "jwt-decode";
class MyAccount extends Component {
  state = {};
  componentDidMount() {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };
    axios.get("admin/myaccount", config).then(
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
        <h2>
          <div>
            <Sidebar />
          </div>
        </h2>
      );
    }
    return <h1 style={{ color: "white" }}>Must be logged in as admin!</h1>;
  }
}

export default MyAccount;
