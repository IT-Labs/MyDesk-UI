import React from 'react'
import { ReactDOM } from 'react'
import Login from '../../Components/LoginForm/Login'

const App = () => {

    const onFinish = (values) => {
  
      console.log('Received values of form: ', values);
  
    };
  
  
  
    return (
  
      <Login/>
  
    );
  
  };