import { loginPage } from "../../support/pages/login";
import { employeeReservationsPage } from "../../support/pages/employee-reservations";
import * as userData from "../../fixtures/userData.json";
import * as urlSlugs from "../../fixtures/urlSlugs.json";

describe("Employees can manage their reservations", () => {
  it("Verify reserved desk is displayed in My reservations", () => {
    cy.visit("/");
    loginPage.doLogin(
      userData.cypressAutomationUserEmail,
      userData.genericPassword
    );
    cy.url().should("contain", urlSlugs.employee + urlSlugs.home);
    cy.assertLoadingDotsNotVisible();
    cy.visit(urlSlugs.employee + urlSlugs.reservations);
    cy.url().should("contain", urlSlugs.employee + urlSlugs.reservations);
    cy.assertLoadingDotsNotVisible();
    employeeReservationsPage.verifyMyFutureReservationsAreShown();
  });

  it("Verify future reserved desk can be cancelled in My reservations", () => {
    cy.visit("/");
    loginPage.doLogin(
      userData.cypressAutomationUserEmail,
      userData.genericPassword
    );
    cy.url().should("contain", urlSlugs.employee + urlSlugs.home);
    cy.assertLoadingDotsNotVisible();
    cy.visit(urlSlugs.employee + urlSlugs.reservations);
    cy.url().should("contain", urlSlugs.employee + urlSlugs.reservations);
    cy.assertLoadingDotsNotVisible();
    employeeReservationsPage.verifyThereIsAtLeastOneReservedDesk();
    employeeReservationsPage.cancelMyReservation();
    employeeReservationsPage.verifyCancellationIsSuccessful();
  });
});
