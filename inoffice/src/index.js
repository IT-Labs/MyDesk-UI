import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MyAccount from "./Pages/MyAccount/MyAccount";
import Login from "./components/LoginForm/Login";
import Register from "./Pages/Register/Register";
import Home from "./Pages/HomePage/HomePage";
import axios from "axios";
import Header from "./components/Header/Header";
axios.defaults.baseURL = "http://localhost:8080/";

const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    <Routes>
      <Route path="/head" element={<Header />} />
      <Route path="/" element={<Login />} />
      <Route path="/admin/myAccount" element={<MyAccount />} />
      <Route path="/employee/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);
