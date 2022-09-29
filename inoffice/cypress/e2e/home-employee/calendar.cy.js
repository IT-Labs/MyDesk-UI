import { loginPage } from "../../support/pages/login";
import { homeEmployeePage } from "../../support/pages/home-employee";
import * as userData from "../../fixtures/userData.json";

describe("Calendar functions in Homepage", () => {
  it("Verify that the user can navigate to next month using the arrow icons", () => {
    cy.visit("/");
    loginPage.doLogin(
      userData.cypressAutomationUserEmail,
      userData.genericPassword
    );
    homeEmployeePage.assertNextMonthIsDisplayed();
    cy.reload();
    homeEmployeePage.assertPreviousMonthIsDisplayed();
  });

  it.only("Verify the calendar displays the current date/month/year by default", () => {
    cy.visit("/");
    loginPage.doLogin(
      userData.cypressAutomationUserEmail,
      userData.genericPassword
    );
    homeEmployeePage.assertCurrentDateIsDefaultDate();
  });
});
