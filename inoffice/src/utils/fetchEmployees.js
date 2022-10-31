import { openError } from "../components/notification/Notification";
import { setEmployees } from "../redux/Employees/employees";

export const fetchEmployees = async (api, dispatch, user) => {
  await api
    .get("employee/all")
    .then(({ data }) => {
      const filteredData = data
        .filter(({ email }) => email !== user.preferred_username)
        .sort((a, b) => a.firstName.localeCompare(b.firstName));
      dispatch(setEmployees(filteredData));
    })
    .catch((err) => {
      err.response.status === 401
        ? openError("Your session has expired, please login again.")
        : openError(
            "We could not get employees, you cannot reserve for other people."
          );
    });
};
