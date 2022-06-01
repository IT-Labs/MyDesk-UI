import * as React from "react";

import EditOffice from "./pages/EditOffice/EditOffice";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./components/LoginForm/Login";
import Loading from "./components/Loading/Loading";
import jwtDecode from "jwt-decode";

const Dashboard = React.lazy(() => import("./pages/Dashboard/Dashboard"));

const Home = React.lazy(() => import("./pages/HomePage/HomePage"));
const Offices = React.lazy(() => import("./pages/Offices/Offices"));
const NoPermissions = React.lazy(() =>
  import("./pages/NoPermissions/NoPermissions")
);
const Configuration = React.lazy(() =>
  import("./pages/Configuration/Configuration")
);
const ReservationList = React.lazy(() =>
  import("./pages/ReservationList/ReservationList")
);
const EmployeeReservationList = React.lazy(() =>
  import("./pages/EmployeeReservations/EmployeeReservations")
);
const PrivateRoute = React.lazy(() => import("./helper/PrivateRoute"));

const App = () => {
  //Routes
  const navigate = useNavigate();
  const token = sessionStorage.getItem("msal.idtoken");

  React.useEffect(() => {
    if (!token) {
      // sessionStorage.clear();
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <React.Suspense fallback={<Loading />}>
      <div className="container">
        <Routes>
          <Route
            path="/employee/home"
            element={<PrivateRoute component={Home} compRoles={["EMPLOYEE"]} />}
          />
          <Route path="/" element={<Login />} />
          {/* <Route path="/register" element={<Register />} /> */}
          <Route exact path="/admin/edit/:name/:id" element={<EditOffice />} />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute component={Dashboard} compRoles={["ADMIN"]} />
            }
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

          {/* <Route
        path="/employeee/informations"
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
      </div>
    </React.Suspense>
  );
};

export default App;
