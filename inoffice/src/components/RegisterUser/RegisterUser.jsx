import { useEffect, useState } from "react";
import { Button, Form, Input, Alert } from "antd";
import { encode as base64_encode } from "base-64";
import api from "../../helper/api";
import styles from "./RegisterUser.module.scss";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";

const RegisterUser = (props) => {
  const showRegisterPage = props.handleShowRegister;
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);

  useEffect(() => {
    setErrorMsg(false);
  }, [confirmPassword, password]);

  const checkPassword = () => {
    return confirmPassword !== password ?? true;
  };

  const handleRegister = async () => {
    if (checkPassword()) {
      setErrorMsg(true);
      return;
    }

    let encodedPassword = base64_encode(password);
    const body = {
      email: email,
      firstname: firstName,
      surname: surname,
      jobTitle: jobTitle,
      password: encodedPassword,
      isAdmin: false,
    };
    api
      .post("/register", body)
      .then(() => {
        showRegisterPage(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={styles.bg}>
      <div className={styles.login}>
        <div className={styles.title}>
          <div className={styles.logo}></div>
          <p>Create your account</p>
        </div>
        <div>
          <Form className={styles.form} onFinish={handleRegister}>
            <Form.Item name="login">
              <Input
                className={styles.input}
                placeholder="Email"
                type="TextArea"
                prefix={<MailOutlined className="site-form-item-icon" />}
                defaultValue=""
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                className={styles.input}
                placeholder="First Name"
                type="TextArea"
                prefix={<UserOutlined className="site-form-item-icon" />}
                defaultValue=""
                required
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                className={styles.input}
                placeholder="Last Name"
                type="TextArea"
                required
                prefix={<UserOutlined className="site-form-item-icon" />}
                defaultValue=""
                onChange={(e) => setSurname(e.target.value)}
              />
              <Input
                className={styles.input}
                placeholder="Job Title"
                type="TextArea"
                prefix={<ShoppingOutlined className="site-form-item-icon" />}
                defaultValue=""
                required
                onChange={(e) => setJobTitle(e.target.value)}
              />
              <Input.Password
                className={styles.input}
                placeholder="Password"
                prefix={<LockOutlined />}
                defaultValue=""
                required
                onChange={(e) => setPassword(e.target.value)}
              />

              <Input.Password
                className={styles.input}
                placeholder="Confirm Password"
                prefix={<LockOutlined />}
                defaultValue=""
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errorMsg ? (
                <Alert
                  message="Password didn't match! Try again."
                  type="error"
                  className={styles.alert}
                />
              ) : null}

              <Button
                htmlType="submit"
                className={`${styles.buttons} ${styles.tealBtn}`}
                block
                size="large"
              >
                Register
              </Button>
            </Form.Item>
          </Form>
        </div>

        <Button
          className={`${styles.register}`}
          type="link"
          size="small"
          onClick={() => showRegisterPage(false)}
        >
          Back to Log in
        </Button>
      </div>
    </div>
  );
};

export default RegisterUser;
