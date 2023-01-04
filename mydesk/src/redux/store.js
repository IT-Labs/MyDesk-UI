import { configureStore } from "@reduxjs/toolkit";
import date from "./Date/Date";
import MyReservationsSelect from "./MyReservations/MyReservationsSelect";
import employees from "./Employees/employees";
import pastReservations from "./MyReservations/PastReservations";
import futureReservations from "./MyReservations/FutureReservations";
import dashboard from "./Dashboard/Dashboard";
import offices from "./Offices/offices";
import avatar from "./Avatar/Avatar";
import card from "./Cards/Card";
import user from "./User/user";
export default configureStore({
  reducer: {
    officeSelect: MyReservationsSelect,
    date,
    employees,
    pastReservations,
    futureReservations,
    dashboard,
    offices,
    avatar,
    card,
    user,
  },
});
