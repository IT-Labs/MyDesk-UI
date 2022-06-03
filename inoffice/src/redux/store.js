import { configureStore } from "@reduxjs/toolkit";
import date from "./Date/Date";
import MyReservationsSelect from "./MyReservationsSelect/MyReservationsSelect";
import employees from "./Employees/employees";

export default configureStore({
  reducer: {
    officeSelect: MyReservationsSelect,
    date,
    employees,
  },
});
