import { loginPage } from "../../support/pages/login";
import { homeEmployeePage } from "../../support/pages/home-employee";
import { adminReservationsPage } from "../../support/pages/admin-reservations";

import * as userData from "../../fixtures/userData.json";
import * as urlSlugs from "../../fixtures/urlSlugs.json";
import * as officesData from "../../fixtures/officesData.json";
import * as coworkerData from "../../fixtures/coworkerData.json";

describe("Admin users can manage the reservations list", () => {
  it("Verify that when the user selects the office, only the reservations made in the selected office are being shown", () => {
    cy.visit("/");
    loginPage.doLogin(
      userData.cypressAutomationUserEmail,
      userData.genericPassword
    );
    cy.url().should("contain", urlSlugs.employee + urlSlugs.home);
    homeEmployeePage.assertUserNameInHeader(
      `${userData.cypressAutomationFirstName} ${userData.cypressAutomationLastName}`
    );
    cy.assertLoadingDotsNotVisible();
    cy.visit(urlSlugs.admin + urlSlugs.reservations);
    cy.assertLoadingDotsNotVisible();
    adminReservationsPage.assertOfficeIsFiltered(officesData.defaultOffice);
  });

  it("Verify that when an users is searched, only the reservations of that user are being shown", () => {
    cy.visit("/");
    loginPage.doLogin(
      userData.cypressAutomationUserEmail,
      userData.genericPassword
    );
    cy.url().should("contain", urlSlugs.employee + urlSlugs.home);
    homeEmployeePage.assertUserNameInHeader(
      `${userData.cypressAutomationFirstName} ${userData.cypressAutomationLastName}`
    );
    cy.assertLoadingDotsNotVisible();
    cy.visit(urlSlugs.admin + urlSlugs.reservations);
    cy.assertLoadingDotsNotVisible();
    adminReservationsPage.assertUserIsFiltered(coworkerData.projectManager);
  });
});
