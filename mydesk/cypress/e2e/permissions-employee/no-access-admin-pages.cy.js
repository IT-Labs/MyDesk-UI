import { loginPage } from "../../support/pages/login";
import { commonsPage } from "../../support/pages/commons";

import { homeEmployeePage } from "../../support/pages/home-employee";
import * as employeeUserData from "../../fixtures/userData.json";
import * as urlSlugs from "../../fixtures/urlSlugs.json";

const ADMIN_PAGES = ["/dashboard", "/reservations", "/users", "/offices"];

describe("Employee users can not access admin", () => {
  beforeEach(() => {
    cy.visit("/");
    loginPage.doLogin(
      employeeUserData.cypressAutomationUserEmail,
      employeeUserData.genericPassword
    );
    loginPage.clickSubmitButton();
    cy.url().should("contain", urlSlugs.employee + urlSlugs.home);
    homeEmployeePage.assertUserNameInHeader(
      `${employeeUserData.cypressAutomationFirstName} ${employeeUserData.cypressAutomationLastName}`
    );
    cy.assertLoadingDotsNotVisible();
  });

  ADMIN_PAGES.forEach((pageSlug) => {
    it(`Verifies employee user can not access to Admin ${pageSlug} page`, () => {
      cy.visit(urlSlugs.admin + pageSlug);
      cy.url().should("contain", urlSlugs.denied);
      commonsPage.verifyAccessDeniedMessageIsDisplayed();
    });
  });
});
