import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./components/LoginForm/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/HomePage/HomePage";
import MyAccount from "./pages/MyAccount/MyAccount";
import Offices from "./pages/Offices/Offices";
import NoPermissions from "./pages/NoPermissions/NoPermissions";
import Configuration from "./pages/Configuration/Configuration";
import ReservationList from "./pages/ReservationList/ReservationList";
import PersonalInformations from "./pages/PersonalInformations/PersonalInformations";
import EmployeeReservationList from "./pages/EmployeeReservations/EmployeeReservations";
import { PrivateRoute } from "./helper/PrivateRoute";

const rootElement = document.getElementById("root");

render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/admin/dashboard"
        element={<PrivateRoute component={Dashboard} roles="ADMIN" />}
      />
      <Route
        path="/admin/offices"
        element={<PrivateRoute component={Offices} roles="ADMIN" />}
      />
      <Route
        path="/admin/configuration"
        element={<PrivateRoute component={Configuration} roles="ADMIN" />}
      />
      <Route
        path="/admin/reservations"
        element={<PrivateRoute component={ReservationList} roles="ADMIN" />}
      />

      <Route
        path="/employee/home"
        element={<PrivateRoute component={Home} roles="EMPLOYEE" />}
      />
      <Route
        path="/employee/informations"
        element={
          <PrivateRoute component={PersonalInformations} roles="EMPLOYEE" />
        }
      />
      <Route
        path="/employee/reservations"
        element={
          <PrivateRoute component={EmployeeReservationList} roles="EMPLOYEE" />
        }
      />
      <Route path="/denied" element={<NoPermissions />} />
      <Route path="/register" element={<Register />} />
      <Route path="/myaccount" element={<MyAccount />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);
