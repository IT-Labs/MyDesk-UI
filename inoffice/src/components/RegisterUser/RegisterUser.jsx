import { useEffect, useState } from 'react';
import { Alert, Button, Form, Input } from 'antd';
import { encode as base64_encode } from 'base-64';
import api from '../../helper/api';
import styles from './RegisterUser.module.scss';
import { LockOutlined, MailOutlined, ShoppingOutlined, UserOutlined } from '@ant-design/icons';
import { openError, openNotification } from '../../components/notification/Notification';

const RegisterUser = (props) => {
  const showRegisterPage = props.handleShowRegister;
  const [ email, setEmail ] = useState('');
  const [ firstName, setFirstName ] = useState('');
  const [ lastName, setLastName ] = useState('');
  const [ jobTitle, setJobTitle ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ confirmPassword, setConfirmPassword ] = useState('');
  const [ errorMsg, setErrorMsg ] = useState(false);

  useEffect(() => {
    setErrorMsg(false);
  }, [ confirmPassword, password ]);

  const checkPassword = () => {
    return confirmPassword !== password ?? true;
  };

  const passwordValidation = () => {
    return (
        ((password.length < 8 && password.length >= 20) ||
            !password.match(/[A-Z]/) ||
            !password.match(/[a-z]/) ||
            !password.match(/[\d`~!@#$%\^&*()+=|;:'",.<>\/?\\\-]/)) ??
        true
    );
  };

  const handleRegister = async () => {
    if (passwordValidation()) {
      openError(
          'Password must contain between 8 and 20 characters, at least one upper character, one lower case character, one special character, and one number.',
      );
      return;
    }
    if (checkPassword()) {
      setErrorMsg(true);
      return;
    }

    let encodedPassword = base64_encode(password);
    const body = {
      email: email,
      firstname: firstName,
      lastName: lastName,
      jobTitle: jobTitle,
      password: encodedPassword,
    };
    api.post('/register', body).then(() => {
      openNotification('Registration successful. Now you can log in.');
      showRegisterPage(false);
    }).catch((err) => {
      openError('Registration failed.');
      console.log(err);
    });
  };

  return (
      <div className={ styles.bg }>
        <div className={ styles.login }>
          <div className={ styles.title }>
            <div className={ styles.logo }></div>
            <p data-cy="create-your-account-label">Create your account</p>
          </div>
          <div>
            <Form className={ styles.form } onFinish={ handleRegister }>
              <Form.Item name="login">
                <Input
                    className={ styles.input }
                    placeholder="Email"
                    data-cy="register-email-input"
                    type="TextArea"
                    prefix={ <MailOutlined className="site-form-item-icon"/> }
                    defaultValue=""
                    required
                    onChange={ (e) => setEmail(e.target.value) }
                />
                <Input
                    className={ styles.input }
                    placeholder="First Name"
                    data-cy="register-firstname-input"
                    type="TextArea"
                    prefix={ <UserOutlined className="site-form-item-icon"/> }
                    defaultValue=""
                    required
                    onChange={ (e) => setFirstName(e.target.value) }
                />
                <Input
                    className={ styles.input }
                    placeholder="Last Name"
                    data-cy="register-lastname-input"
                    type="TextArea"
                    required
                    prefix={ <UserOutlined className="site-form-item-icon"/> }
                    defaultValue=""
                    onChange={ (e) => setLastName(e.target.value) }
                />
                <Input
                    className={ styles.input }
                    placeholder="Job Title"
                    type="TextArea"
                    data-cy="register-jobtitle-input"
                    prefix={ <ShoppingOutlined className="site-form-item-icon"/> }
                    defaultValue=""
                    required
                    onChange={ (e) => setJobTitle(e.target.value) }
                />
                <Input.Password
                    className={ styles.input }
                    data-cy="password-input"
                    placeholder="Password"
                    prefix={ <LockOutlined/> }
                    defaultValue=""
                    required
                    onChange={ (e) => setPassword(e.target.value) }
                />

                <Input.Password
                    className={ styles.input }
                    data-cy="password-confirm-input"
                    placeholder="Confirm Password"
                    prefix={ <LockOutlined/> }
                    defaultValue=""
                    required
                    onChange={ (e) => setConfirmPassword(e.target.value) }
                />
                { errorMsg ? (
                    <Alert
                        data-cy="password-not-matching-alert"
                        message="Password didn't match! Try again."
                        type="error"
                        className={ styles.alert }
                    />
                ) : null }

                <Button
                    htmlType="submit"
                    data-cy="register-submit-button"
                    className={ `${ styles.buttons } ${ styles.tealBtn }` }
                    block
                    size="large"
                >
                  Register
                </Button>
              </Form.Item>
            </Form>
          </div>

          <Button
              className={ `${ styles.register }` }
              type="link"
              size="small"
              onClick={ () => showRegisterPage(false) }
          >
            Back to Log in
          </Button>
        </div>
      </div>
  );
};

export default RegisterUser;
