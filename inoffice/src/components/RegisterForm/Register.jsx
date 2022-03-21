import "antd/dist/antd.css";
import { Form, Input, Button, Checkbox } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import "../../index.css";
import React, { Component } from "react";
import JobTitle from "../inputs/JobTitle"
import FirstName from "../inputs/FirstName"
import LastName from "../inputs/LastName"
import EmailComponent from  "../inputs/EmailComponent"
import PasswordComponent from "../inputs/PasswordComponent"
import ConfirmPassword from "../inputs/ConfirmPassword"
import api from "../../helper/api";
import jwt from "jwt-decode";
import UserHead from "../Head/UserHead";

class Register extends Component {
  config = {
    token: localStorage.getItem("token"),
  };
  state = {};

  handleSubmit = (e) => {
    const data = {
      FirstName: e.firstname,
      LastName: e.lastname,
      Email: e.email,
      JobTitle: e.jobtitle,
      password: e.password,
    };
    api
      .post("register", data)
      .then((res) => {
        if(res.data=="Success")
          window.location= "/"
        else 
        {
          document.getElementById("hiddeninput").textContent="Email already exist"
        }

      }).catch((err) => {
        this.setState({
          error: "invalid credentials",
        });
      });
  };
  render() {
    if(this.config.token != null){
        const m = jwt(this.config.token);
          if (m.role == "ADMIN") {
           window.location="/admin/dashboard"
          } else if (m.role == "EMPLOYEE") {
            window.location="/employee/home"
          }
    }
    else {
      return (
        <div className="FormLogin">
            <h1 className="header">inOffice</h1>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={this.handleSubmit}
          >
            <EmailComponent />
              <p style={{ color: "red", fontSize:"20px"}} id="hiddeninput"></p>
            <FirstName />
            <LastName />
            <JobTitle />
            <PasswordComponent />
            <ConfirmPassword />
            <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  style={{ backgroundColor: "white", color: "blue" }}
                >
                  Register
                  </Button>
               <Link to="/" style={{ color: "white", display: "flex" ,textAlign: "center", justifyContent: "center" }}>
                Log in
              </Link>
            </Form.Item>
            
          </Form>
        </div>
      );
    }
    
  }
}

export default Register;
