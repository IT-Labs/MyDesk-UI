import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MyAccount from "./Pages/MyAccount/MyAccount";
import Login from "./components/LoginForm/Login";
import Register from "./Pages/Register/Register";
import Home from "./Pages/HomePage/HomePage";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080/";

const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin/myAccount" element={<MyAccount />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);
