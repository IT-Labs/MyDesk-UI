import { loginPage } from "../../support/pages/login";
import { homeEmployeePage } from "../../support/pages/home-employee";
import * as userData from "../../fixtures/userData.json";

describe("Users can select a desk", () => {
  it("Verify that the user can select a single future date from the calendar", () => {
    cy.visit("/");
    loginPage.doLogin(
      userData.cypressAutomationUserEmail,
      userData.genericPassword
    );
    homeEmployeePage.selectOffice("IT-Labs Skopje");
    homeEmployeePage.openCalendar();
    homeEmployeePage.selectFirstAvailableDayOfNextMonth();
    homeEmployeePage.selectFirstAvailableDayOfNextMonth();
    cy.wait(10000);
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
    homeEmployeePage.selectOffice("IT-Labs Skopje");
    homeEmployeePage.openCalendar();
    homeEmployeePage.selectFirstAvailableDayOfNextMonth();
    homeEmployeePage.selectFirstAvailableDayOfNextMonth();
    cy.wait(10000);
    homeEmployeePage.filterByAvailability("Available");
    homeEmployeePage.selectDeskN(1);
    homeEmployeePage.reserveButton().click();
    homeEmployeePage.verifyReservationIsSuccessful();
  });

  it("Verify that Reserve button is disabled when a reserved desk is selected", () => {
    cy.visit("/");
    loginPage.doLogin(
      userData.cypressAutomationUserEmail,
      userData.genericPassword
    );
    homeEmployeePage.selectOffice("IT-Labs Skopje");
    homeEmployeePage.openCalendar();
    homeEmployeePage.selectFirstAvailableDayOfNextMonth();
    homeEmployeePage.selectFirstAvailableDayOfNextMonth();
    cy.wait(10000);
    homeEmployeePage.filterByAvailability("Reserved");
    homeEmployeePage.selectDeskN(1);
    homeEmployeePage.assertButtonReserveIsDisabled();
  });
});
