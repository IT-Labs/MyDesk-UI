import { loginPage } from "../../support/pages/login";
import { homeEmployeePage } from "../../support/pages/home-employee";
import * as adminUserData from "../../fixtures/adminUserData.json";

describe("Calendar functions in Homepage", () => {
  it("Verify that the user can navigate to next month using the arrow icons", () => {
    cy.visit("/");
    loginPage.doLogin(
      adminUserData.cypressAutomationUserEmail,
      adminUserData.genericPassword
    );
    homeEmployeePage.assertNextMonthIsDisplayed();
    cy.reload();
    homeEmployeePage.assertPreviousMonthIsDisplayed();
  });

  it("Verify the calendar displays the current date/month/year by default", () => {
    cy.visit("/");
    loginPage.doLogin(
      adminUserData.cypressAutomationUserEmail,
      adminUserData.genericPassword
    );
    homeEmployeePage.assertCurrentDateIsDefaultDate();
  });

  it("Verify that the user can select a single future date from the calendar", () => {
    cy.visit("/");
    loginPage.doLogin(
      adminUserData.cypressAutomationUserEmail,
      adminUserData.genericPassword
    );
    homeEmployeePage.openCalendar();
    homeEmployeePage.selectFirstAvailableDayOfNextMonth();
    homeEmployeePage.selectFirstAvailableDayOfNextMonth();
    homeEmployeePage.assertSingleDateIsSelected();
  });

  it("Verify that the user can select a time span from the calendar", () => {
    cy.visit("/");
    loginPage.doLogin(
      adminUserData.cypressAutomationUserEmail,
      adminUserData.genericPassword
    );
    homeEmployeePage.openCalendar();
    homeEmployeePage.selectFirstAvailableDayOfNextMonth();
    homeEmployeePage.selectLastAvailableDayOfNextMonth();
    homeEmployeePage.assertRangeDateIsSelected();
  });

  it("Verify that all past days are shadowed and can not be selected", () => {
    cy.visit("/");
    loginPage.doLogin(
      adminUserData.cypressAutomationUserEmail,
      adminUserData.genericPassword
    );
    homeEmployeePage.openCalendar();
    homeEmployeePage.verifyPastDatesAreDisabledInCalendar();
  });

  // Failing due to bug https://dev.azure.com/ITLabs-LLC/Internship%202022/_workitems/edit/53148/
  // @TODO remove skip once bug is fixed
  it.skip("Verify that all weekends are shadowed and can not be selected", () => {
    cy.visit("/");
    loginPage.doLogin(
      adminUserData.cypressAutomationUserEmail,
      adminUserData.genericPassword
    );
    homeEmployeePage.openCalendar();
    homeEmployeePage.verifyWeekendsAreDisabledInCalendar();
  });
});
