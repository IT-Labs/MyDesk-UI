import EditOffice from "./pages/EditOffice/EditOffice";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./components/LoginForm/Login";
import Loading from "./components/Loading/Loading";
import { useEffect, lazy, Suspense } from "react";
import jwtDecode from "jwt-decode";

const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));

const Home = lazy(() => import("./pages/HomePage/HomePage"));
const Offices = lazy(() => import("./pages/Offices/Offices"));
const NoPermissions = lazy(() => import("./pages/NoPermissions/NoPermissions"));

const ReservationList = lazy(() =>
  import("./pages/ReservationList/ReservationList")
);
const EmployeeReservationList = lazy(() =>
  import("./pages/EmployeeReservations/EmployeeReservations")
);
const PrivateRoute = lazy(() => import("./helper/PrivateRoute"));

const App = () => {
  //Routes
  const navigate = useNavigate();
  const token = localStorage.getItem("msal.idtoken");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <Suspense fallback={<Loading />}>
      <div className="container">
        <Routes>
          <Route
            path="/employee/home"
            element={<PrivateRoute component={Home} compRoles={["EMPLOYEE"]} />}
          />
          <Route path="/" element={<Login />} />
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
            path="/admin/reservations"
            element={
              <PrivateRoute component={ReservationList} compRoles={["ADMIN"]} />
            }
          />

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
        </Routes>
      </div>
    </Suspense>
  );
};

export default App;
