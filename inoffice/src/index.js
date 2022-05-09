import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./components/LoginForm/Login";
import Home from "./pages/HomePage/HomePage";
import MyAccount from "./pages/MyAccount/MyAccount";
import Offices from "./pages/Offices/Offices";
import NoPermissions from "./pages/NoPermissions/NoPermissions";
import Configuration from "./pages/Configuration/Configuration";
import ReservationList from "./pages/ReservationList/ReservationList";
import PersonalInformations from "./pages/PersonalInformations/PersonalInformations";
import EmployeeReservationList from "./pages/EmployeeReservations/EmployeeReservations";
import { PrivateRoute } from "./helper/PrivateRoute";

import EditOffice from "./pages/EditOffice/EditOffice";
const rootElement = document.getElementById("root");

render(
  <BrowserRouter>
    <Routes>
      <Route exact path="/admin/edit/:name/:id" element={<EditOffice />} />
      <Route path="/" element={<Login />} />
      {/* <Route path="/register" element={<Register />} /> */}
      <Route
        path="/admin/dashboard"
        element={<PrivateRoute component={Dashboard} compRoles={["ADMIN"]} />}
      />
      <Route
        path="/admin/offices"
        element={<PrivateRoute component={Offices} compRoles={["ADMIN"]} />}
      />
      <Route
        path="/admin/configuration"
        element={
          <PrivateRoute component={Configuration} compRoles={["ADMIN"]} />
        }
      />
      <Route
        path="/admin/reservations"
        element={
          <PrivateRoute component={ReservationList} compRoles={["ADMIN"]} />
        }
      />

      <Route
        path="/employee/home"
        element={<PrivateRoute component={Home} compRoles={["EMPLOYEE"]} />}
      />
      {/* <Route
        path="/employee/informations"
        element={
          <PrivateRoute
            component={PersonalInformations}
            compRoles={["EMPLOYEE"]}
          />
        }
      /> */}
      <Route
        path="/employee/reservations"
        element={
          <PrivateRoute
            component={EmployeeReservationList}
            compRoles={["EMPLOYEE", "ADMIN"]}
          />
        }
      />
      <Route path="/denied" element={<NoPermissions />} />
      {/* <Route
        path="/myaccount"
        element={
          <PrivateRoute component={MyAccount} roles={["ADMIN", "EMPLOYEE"]} />
        }
      /> */}
    </Routes>
  </BrowserRouter>,
  rootElement
);
