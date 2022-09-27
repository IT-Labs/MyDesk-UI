import { loginPage } from "../../support/pages/login";
import { homeEmployeePage } from "../../support/pages/home-employee";
import * as userData from "../../fixtures/userData.json";
import * as urlSlugs from "../../fixtures/urlSlugs.json";

describe("Login functionality", () => {
  it("Verifies user can login with valid credentials", () => {
    cy.visit("/");
    loginPage.doLogin(
      userData.cypressAutomationUserEmail,
      userData.genericPassword
    );
    loginPage.clickSubmitButton();
    cy.url().should("contain", urlSlugs.employee + urlSlugs.home);
    homeEmployeePage.assertUserNameInHeader(
      `${userData.cypressAutomationFirstName} ${userData.cypressAutomationLastName}`
    );
  });

  it("Verifies user can logout", () => {
    cy.visit("/");
    loginPage.doLogin(
      userData.cypressAutomationUserEmail,
      userData.genericPassword
    );
    loginPage.clickSubmitButton();
    cy.url().should("contain", urlSlugs.employee + urlSlugs.home);
    homeEmployeePage.assertUserNameInHeader(
      `${userData.cypressAutomationFirstName} ${userData.cypressAutomationLastName}`
    );
    homeEmployeePage.clickLogoutButton();
    cy.url().should("eq", Cypress.config("baseUrl"));
  });

  it("Verifies user can login with valid credentials and pressing Enter key", () => {
    cy.visit("/");
    loginPage.emailInput().type(userData.cypressAutomationUserEmail);
    loginPage.passwordInput().type(userData.genericPassword);
    loginPage.passwordInput().type(`{enter}`);

    cy.url().should("contain", urlSlugs.employee + urlSlugs.home);
    homeEmployeePage.assertUserNameInHeader(
      `${userData.cypressAutomationFirstName} ${userData.cypressAutomationLastName}`
    );
  });

  it("Verify that user cannot access login/register page while is logged in", () => {
    cy.visit("/");
    loginPage.doLogin(
      userData.cypressAutomationUserEmail,
      userData.genericPassword
    );

    cy.url().should("contain", urlSlugs.employee + urlSlugs.home);
    loginPage.registerButton().should("have.length", 0);
    cy.get(`a[href="/"]`).should("have.length", 0);

    cy.visit(urlSlugs.employee + urlSlugs.reservations);
    loginPage.registerButton().should("have.length", 0);
    cy.get(`a[href="/"]`).should("have.length", 0);
  });
});
