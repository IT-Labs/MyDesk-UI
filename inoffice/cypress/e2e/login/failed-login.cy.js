import { loginPage } from "../../support/pages/login";
import * as userData from "../../fixtures/userData.json";

describe("Login failed functionality", () => {
  const INCORRECT_PASSWORD = "incorrect-password";

  it("Verifies user cannot login with invalid credentials", () => {
    cy.visit("/");
    loginPage.doLogin("incorrect-email@test.com", INCORRECT_PASSWORD);
    loginPage.verifyIncorrectCredentialsMessageIsDisplayed();
  });

  it("Verifies user cannot login with valid email and invalid password", () => {
    cy.visit("/");
    loginPage.doLogin(userData.cypressAutomationUserEmail, INCORRECT_PASSWORD);
    loginPage.verifyIncorrectCredentialsMessageIsDisplayed();
  });

  it("Verifies user cannot login empty credentials", () => {
    cy.visit("/");
    loginPage.clickSubmitButton();
    cy.url().should("eq", Cypress.config("baseUrl"));
  });
});
