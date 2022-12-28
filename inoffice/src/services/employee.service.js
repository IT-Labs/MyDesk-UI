import { openError } from "../components/notification/Notification";
import { setEmployees } from "../redux/Employees/employees";
import api from "../helper/api";

export const fetchEmployeesApi = async (dispatch) => {
  await api
    .get("employee/all")
    .then(({ data }) => {
      const filteredData = data.sort((a, b) =>
        a.firstName.localeCompare(b.firstName)
      );
      dispatch(setEmployees(filteredData));
    })
    .catch((err) => {
      err.response && err.response.status === 401
        ? openError("Your session has expired, please login again.")
        : openError(
            "We could not get employees, you cannot reserve for other people."
          );
    });
};

export const updateEmployeeApi = (userId, body) => {
  return api.put(`/admin/employee/${userId}`, body).catch((err) => {
    openError(err.response.data[0]);
    console.log(err.response);
  });
};
