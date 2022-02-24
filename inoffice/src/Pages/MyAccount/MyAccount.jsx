import { Component } from "react/cjs/react.production.min";
import Sidebar from "../../components/Sidebar/Sidebar";
import axios from "axios";

class MyAccount extends Component {
  state = {};
  componentDidMount() {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("user"),
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
    return <div>Must be logged in!</div>;
  }
}

export default MyAccount;
