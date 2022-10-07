import { loginPage } from "../../support/pages/login";
import { homeEmployeePage } from "../../support/pages/home-employee";
import { employeeReservationsPage } from "../../support/pages/employee-reservations";
import * as userData from "../../fixtures/userData.json";
import * as urlSlugs from "../../fixtures/urlSlugs.json";

describe("Users can select a desk", () => {
  it("Verify that the homepage offices list contains all the offices that are placed in the admin Offices list", () => {
    cy.visit("/");
    loginPage.doLogin(
      userData.cypressAutomationUserEmail,
      userData.genericPassword
    );
    homeEmployeePage.getOfficesListInHomepage();
    cy.visit(urlSlugs.employee + urlSlugs.reservations);
    employeeReservationsPage.getOfficesListInReservations();
    employeeReservationsPage.assertOfficesAreTheSameAsHomepage();
  });

  it.only("Verify that the user can select an office from the list", () => {
    cy.visit("/");
    loginPage.doLogin(
      userData.cypressAutomationUserEmail,
      userData.genericPassword
    );
    cy.url().should("contain", urlSlugs.employee + urlSlugs.home);
    homeEmployeePage.assertUserNameInHeader(
      `${userData.cypressAutomationFirstName} ${userData.cypressAutomationLastName}`
    );
    homeEmployeePage.assertLoadingDotsNotVisible();
    cy.visit(urlSlugs.employee + urlSlugs.reservations);
    employeeReservationsPage.assertOfficeIsFiltered();
  });
});
