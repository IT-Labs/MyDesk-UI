import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MyAccount from "./Pages/MyAccount/MyAccount";
import Login from "./components/LoginForm/Login";
import Register from "./Pages/Register/Register";

const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/myAccount" element={<MyAccount />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);
