import { loginPage } from "../../support/pages/login";
import * as userData from "../../fixtures/userData.json";

describe("Login failed functionality", () => {
  it("Remember me checkbox on login page is unselected by default", () => {
    cy.visit("/");
    loginPage.assertRememberMeIsUnchecked();
  });

  it.only("Verify that when the “Remember me” checkbox on login page is selected, credentials are remembered", () => {
    cy.visit("/");
    loginPage.doLoginWithRemember(
      userData.cypressAutomationUserEmail,
      userData.genericPassword
    );
  });
});
