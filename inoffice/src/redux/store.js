import { configureStore } from "@reduxjs/toolkit";
import date from "./Date/Date";
import MyReservationsSelect from "./MyReservationsSelect/MyReservationsSelect";

export default configureStore({
  reducer: {
    officeSelect: MyReservationsSelect,
    date,
  },
});
