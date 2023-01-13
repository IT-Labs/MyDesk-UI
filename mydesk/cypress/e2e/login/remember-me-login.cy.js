import { loginPage } from "../../support/pages/login";
import { homeEmployeePage } from "../../support/pages/home-employee";
import * as adminUserData from "../../fixtures/adminUserData.json";

describe("Remember me functionality", () => {
  it("Remember me checkbox on login page is unselected by default", () => {
    cy.visit("/");
    loginPage.assertRememberMeIsUnchecked();
  });

  // Failing due to bug https://dev.azure.com/ITLabs-LLC/Internship%202022/_workitems/edit/50382/
  // @TODO remove skip once bug is fixed
  it.skip("Verify that when the “Remember me” checkbox on login page is selected, credentials are remembered", () => {
    cy.visit("/");
    loginPage.doLoginWithRemember(
      adminUserData.cypressAutomationUserEmail,
      adminUserData.genericPassword
    );
    homeEmployeePage.clickLogoutButton();
    loginPage.assertCredentialsAreRemembered(
      adminUserData.cypressAutomationUserEmail
    );
  });
});
