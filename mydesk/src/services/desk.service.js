import api from "../helper/api";
import { openError } from "../components/notification/Notification";

let controller = new AbortController();
const signalObj = { signal: controller.signal };

export const fetchAdminAllDeskApi = async (officeId) => {
  return await api.get("admin/office-desks/" + officeId).catch((error) => {
    console.log(error);
    openError("There was an error while loading");
  });
};

export const fetchAllDeskApi = async (officeId) => {
  return await api
    .get(`employee/office-desks/${officeId}`, signalObj)
    .catch((error) => {
      console.error(error);
    });
};

export const fetchDeskApi = async (officeId, skipProp) => {
  return await api
    .get(
      `employee/office-desks/${officeId}/?top=20&skip=${skipProp}`,
      signalObj
    )
    .catch((error) => {
      console.error(error);
    });
};

export const updateOfficeDeskApi = async (properlySortedData) => {
  return await api
    .put("admin/office-desks", properlySortedData)
    .catch((error) => {
      console.log(error.response.data);
      error.response.status === 401
        ? openError("Your session has expired, please login again.")
        : openError("It seems there was an error while saving");
    });
};

export const addNewDeskApi = async (officeId, data) => {
  return await api
    .post("admin/office-desks/" + officeId, data)
    .catch((error) => {
      error.response.status === 401
        ? openError("Your session has expired, please login again.")
        : openError(
            "An error occurred while updating the entities, please try again"
          );

      console.log(error.response);
    });
};
export const deleteDeskApi = async (deskId) => {
  return await api.delete("admin/office-desks/" + deskId).catch((error) => {
    error.response.status === 401
      ? openError("Your session has expired, please login again.")
      : openError(
          "An error occurred while deleting the entity, please try again"
        );
  });
};
