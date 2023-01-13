import { commonsPage } from "../../support/pages/commons";
import { loginPage } from "../../support/pages/login";
import { homeEmployeePage } from "../../support/pages/home-employee";
import { usersManagementPage } from "../../support/pages/users-management";

import * as urlSlugs from "../../fixtures/urlSlugs.json";
import * as adminUserData from "../../fixtures/adminUserData.json";

describe("Verify an admin user can add new users", () => {
  const EMAIL_ADDRESS = "random-email@it-labs.com";

  it("Verify an admin user can add a new user successfully", () => {
    cy.visit("/");
    loginPage.doLogin(
      adminUserData.cypressAutomationUserEmail,
      adminUserData.genericPassword
    );
    cy.url().should("contain", urlSlugs.employee + urlSlugs.home);
    homeEmployeePage.assertUserNameInHeader(
      `${adminUserData.cypressAutomationFirstName} ${adminUserData.cypressAutomationLastName}`
    );
    cy.assertLoadingDotsNotVisible();
    cy.visit(urlSlugs.admin + urlSlugs.users);
    cy.assertLoadingDotsNotVisible();
    commonsPage.assertTitleInAdminPages("Users");
    usersManagementPage.addNewUser(EMAIL_ADDRESS);
    usersManagementPage.verifySuccessfullyAddedNewUserMessage();
  });
});
