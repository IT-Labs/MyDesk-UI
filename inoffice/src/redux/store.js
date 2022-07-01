import { configureStore } from "@reduxjs/toolkit";
import date from "./Date/Date";
import MyReservationsSelect from "./MyReservations/MyReservationsSelect";
import employees from "./Employees/employees";
import pastReservations from "./MyReservations/PastReservations";
import futureReservations from "./MyReservations/FutureReservations";

export default configureStore({
  reducer: {
    officeSelect: MyReservationsSelect,
    date,
    employees,
    pastReservations,
    futureReservations,
  },
});
