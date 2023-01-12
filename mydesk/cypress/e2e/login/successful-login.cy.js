import { loginPage } from "../../support/pages/login";
import { homeEmployeePage } from "../../support/pages/home-employee";
import * as adminUserData from "../../fixtures/adminUserData.json";
import * as urlSlugs from "../../fixtures/urlSlugs.json";

describe("Sucess Login functionality", () => {
  it("Verifies user can login with valid credentials", () => {
    cy.visit("/");
    loginPage.doLogin(
      adminUserData.cypressAutomationUserEmail,
      adminUserData.genericPassword
    );
    loginPage.clickSubmitButton();
    cy.url().should("contain", urlSlugs.employee + urlSlugs.home);
    homeEmployeePage.assertUserNameInHeader(
      `${adminUserData.cypressAutomationFirstName} ${adminUserData.cypressAutomationLastName}`
    );
  });

  it("Verifies user can logout", () => {
    cy.visit("/");
    loginPage.doLogin(
      adminUserData.cypressAutomationUserEmail,
      adminUserData.genericPassword
    );
    loginPage.clickSubmitButton();
    cy.url().should("contain", urlSlugs.employee + urlSlugs.home);
    homeEmployeePage.assertUserNameInHeader(
      `${adminUserData.cypressAutomationFirstName} ${adminUserData.cypressAutomationLastName}`
    );
    homeEmployeePage.clickLogoutButton();
    cy.url().should("eq", Cypress.config("baseUrl"));
  });

  it("Verifies user can login with valid credentials and pressing Enter key", () => {
    cy.visit("/");
    loginPage.doLoginWithEnter(
      adminUserData.cypressAutomationUserEmail,
      adminUserData.genericPassword
    );
    cy.url().should("contain", urlSlugs.employee + urlSlugs.home);
    homeEmployeePage.assertUserNameInHeader(
      `${adminUserData.cypressAutomationFirstName} ${adminUserData.cypressAutomationLastName}`
    );
  });

  it("Verify that user cannot access login/register page while is logged in", () => {
    cy.visit("/");
    loginPage.doLogin(
      adminUserData.cypressAutomationUserEmail,
      adminUserData.genericPassword
    );
    cy.url().should("contain", urlSlugs.employee + urlSlugs.home);
    loginPage.assertRegisterButtonDoesntExist();
    loginPage.assertLoginPageLinkDoesntExist();
    cy.visit(urlSlugs.employee + urlSlugs.reservations);
    loginPage.assertRegisterButtonDoesntExist();
    loginPage.assertLoginPageLinkDoesntExist();
  });
});
