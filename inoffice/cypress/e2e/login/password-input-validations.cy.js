import { loginPage } from "../../support/pages/login";
import * as userData from "../../fixtures/userData.json";

describe("Password input validations", () => {
  it("Verify that the password is masked form when typed in field password", () => {
    cy.visit("/");
    loginPage.passwordInput().type(userData.genericPassword);
    loginPage
      .passwordInput()
      .should("have.value", userData.genericPassword)
      .should("have.attr", "type", "password");
    loginPage.showPasswordButton().click();
    loginPage
      .passwordInput()
      .should("have.value", userData.genericPassword)
      .should("have.attr", "type", "text");
  });
});
