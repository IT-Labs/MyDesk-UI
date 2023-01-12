import { loginPage } from "../../support/pages/login";
import * as adminUserData from "../../fixtures/adminUserData.json";

describe("Password input validations", () => {
  it("Verify that the password is masked when typed in field password", () => {
    cy.visit("/");
    loginPage.assertPasswordInputIsMasked(adminUserData.genericPassword);
  });
  it("Verify that the password is not masked when Show Password button is clicked", () => {
    cy.visit("/");
    loginPage.clickSubmitShowPasswordButton();
    loginPage.assertPasswordInputIsNotMasked(adminUserData.genericPassword);
  });

  it("Verify that the password cant be copied/pasted", () => {
    cy.visit("/");
    loginPage.assertPasswordCantBeCopiedAndPasted(
      adminUserData.genericPassword
    );
  });
});
