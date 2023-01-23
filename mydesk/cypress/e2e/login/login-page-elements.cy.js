import { loginPage } from "../../support/pages/login";

it("Verify the presence of Microsoft SSO button on Login Page", () => {
  cy.visit("/");
  loginPage.verifyPresenceOfMicrosoftSSOButton();
});

it("Verify login page title", () => {
  cy.visit("/");
  loginPage.verifyLoginPageTitle();
});

it("Verify that login page contains welcome text", () => {
  cy.visit("/");
  loginPage.verifyWelcomeBackText();
});
