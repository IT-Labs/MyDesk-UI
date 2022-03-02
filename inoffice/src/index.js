import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Login from "./components/LoginForm/Login";
import Register from "./Pages/Register/Register";
import Home from "./Pages/HomePage/HomePage";
import axios from "axios";
import MyAccount from "./Pages/MyAccount/MyAccount";
import Offices from "./Pages/Offices/Offices";
import Sidebar from "./components/Sidebar/Sidebar";


axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/sideTest" element={<Sidebar />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/offices" element={<Offices />} />
      <Route path="/employee/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/myaccount" element={<MyAccount />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);
