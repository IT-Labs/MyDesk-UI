import api from "../helper/api";
import { openError } from "../components/notification/Notification";

export const fetchAllOfficesApi = async () => {
  return await api.get("employee/offices").catch((error) => {
    console.error(error.message);
  });
};

export const fetchAllOfficesAdminApi = async () => {
  return await api.get("admin/offices").catch((err) => console.log(err));
};

export const fetchOfficeImageApi = async (officeId) => {
  return await api.get("employee/office/image/" + officeId);
};

export const fetchAdminOfficeImageApi = async (officeId) => {
  return await api.get("admin/office/image/" + officeId).catch((error) => {
    console.log(error);
  });
};

export const addOfficeApi = (newOffice) => {
  return api.post("admin/office", newOffice).catch((err) => {
    err.response.status === 401
      ? openError("Your session has expired, please login again.")
      : openError(err.response.data);
  });
};
export const editOfficeApi = (officeId, data) => {
  return api.put("admin/office/" + officeId, data).catch((error) => {
    console.log(error.response);
    openError("An office with that name and location already exists");
  });
};

export const deleteOfficeApi = (officeId) => {
  return api.delete("admin/office/" + officeId).catch((error) => {
    error.response.status === 401
      ? openError("Your session has expired, please login again.")
      : openError(
          "An error occurred while deleting the office, please try again"
        );

    console.log(error);
  });
};
