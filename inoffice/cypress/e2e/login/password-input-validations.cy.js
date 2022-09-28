import { loginPage } from "../../support/pages/login";
import * as userData from "../../fixtures/userData.json";

describe("Password input validations", () => {
  it("Verify that the password is masked when typed in field password", () => {
    cy.visit("/");
    loginPage.assertPasswordInputIsMasked(userData.genericPassword);
  });
  it("Verify that the password is not masked when Show Password button is clicked", () => {
    cy.visit("/");
    loginPage.clickSubmitShowPasswordButton();
    loginPage.assertPasswordInputIsNotMasked(userData.genericPassword);
  });
});
