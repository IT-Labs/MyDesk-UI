import jwtDecode from "jwt-decode";
import { setEmployees } from "../redux/Employees/employees";

export const fetchEmployees = async (api, dispatch, notification) => {
  await api
    .get("employee/all")
    .then(({ data }) => {
      const { preferred_username } = jwtDecode(
        sessionStorage.getItem("msal.idtoken")
      );
      const filteredData = data
        .filter(({ email }) => email !== preferred_username)
        .sort((a, b) => a.firstName.localeCompare(b.firstName));
      dispatch(setEmployees(filteredData));
    })
    .catch((err) => {
      notification.info({
        message: `Notification`,
        description:
          "We could not get employees, you cannot reserve for other people.",
        duration: 2,
        placement: "top",
      });
    });
};
