import { loginPage } from "../../support/pages/login";
import { homeEmployeePage } from "../../support/pages/home-employee";
import * as userData from "../../fixtures/userData.json";

describe("Users can select a desk", () => {
  it("Verify that the user can select only one desk in a reservation", () => {
    cy.visit("/");
    loginPage.doLogin(
      userData.cypressAutomationUserEmail,
      userData.genericPassword
    );
    homeEmployeePage.openCalendar();
    homeEmployeePage.selectFirstAvailableDayOfNextMonth();
    homeEmployeePage.selectFirstAvailableDayOfNextMonth();
    homeEmployeePage.filterByAvailability("Available");
    homeEmployeePage.selectDeskN(1);
    homeEmployeePage.selectDeskN(2);
    homeEmployeePage.verifyOnlyOneDeskIsSelected();
  });

  it("Complete a reservation successfully", () => {
    cy.visit("/");
    loginPage.doLogin(
      userData.cypressAutomationUserEmail,
      userData.genericPassword
    );
    homeEmployeePage.openCalendar();
    homeEmployeePage.selectFirstAvailableDayOfNextMonth();
    homeEmployeePage.selectFirstAvailableDayOfNextMonth();
    homeEmployeePage.filterByAvailability("Available");
    homeEmployeePage.selectDeskN(1);
    homeEmployeePage.reserveButton().click();
    homeEmployeePage.verifyReservationIsSuccessful();
  });
});
