import api from "../helper/api";
import { openError } from "../components/notification/Notification";

export const sendReservationApi = (data) => {
  return api.post("employee/reserve/coworker", data).catch((error) => {
    console.log(error.response);
    if (error.response.status === 401) {
      return openError("Your session has expired, please login again.");
    }
    return error.response.data.ErrorMessage
      ? openError(error.response.data.ErrorMessage)
      : openError(error.response.data.errors.reservationRequest[0]);
  });
};

export const getAllFutureReservationsApi = (skip) => {
  const pagination = skip !== undefined ? `?top=4&skip=${skip}` : "";
  return api
    .get(`employee/future-reservation/all${pagination}`)
    .catch((err) => {
      console.log(err);
    });
};

export const getAllPastReservationsApi = (skip) => {
  const pagination = skip !== undefined ? `?top=4&skip=${skip}` : "";
  return api.get(`employee/past-reservations/all${pagination}`).catch((err) => {
    console.log(err);
  });
};

export const getMyPastReservationsApi = () => {
  return api.get("employee/past-reservations").catch((error) => {
    console.error("Error message");
  });
};

export const getMyFutureReservationsApi = () => {
  return api.get("employee/future-reservation").catch((error) => {
    console.error(error);
    openError("There appears to be problem at our end");
  });
};
export const cancelReservationApi = (id) => {
  return api.delete("employee/reserve/" + id).catch((error) => {
    error.response.status === 401
      ? openError("Your session has expired, please login again.")
      : openError(
          "An error occurred while canceling the reservation, please try again"
        );
  });
};
