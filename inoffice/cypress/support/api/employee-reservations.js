import * as apiEndpoints from "../../fixtures/apiEndpoints.json";

export class EmployeeReservationsAPI {
  getMyFutureReservationsAPI() {
    cy.getTokenFromLocalStorage().then((userToken) => {
      cy.request({
        url: `${apiEndpoints.baseApiUrl}${apiEndpoints.myFutureReservations}`,
        auth: {
          bearer: userToken,
        },
      })
        .its("body")
        .as("myFutureReservationsAPI");
    });
  }
}
export const employeeReservationsAPI = new EmployeeReservationsAPI();
