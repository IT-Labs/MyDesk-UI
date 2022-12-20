import api from "../helper/api";
import { openError } from "../components/notification/Notification";

export const getAllReviewsApi = () => {
  return api.get("employee/reviews/all");
};

export const showReviewApi = (reviewId) => {
  return api.get("employee/review/" + reviewId).catch((error) => {
    console.error("Error message");
  });
};

export const writeReviewApi = (data) => {
  return api.post("employee/review", data).catch((error) => {
    error.response.status === 401
      ? openError("Your session has expired, please login again.")
      : openError(
          "An error occurred while saving your review, please try again"
        );
  });
};

export const showReviewsForSelectedCardApi = (selectedCardId) => {
  return api
    .get(`entity/reviews/${selectedCardId}`)
    .then(({ data }) => {
      if (data.length) {
        return data;
      } else {
        return [{ reviews: "There were no available reviews" }];
      }
    })
    .catch(() => {
      return ["There were no available reviews"];
    });
};
