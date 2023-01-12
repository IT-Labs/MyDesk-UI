import { loginPage } from "../../support/pages/login";
import { homeEmployeePage } from "../../support/pages/home-employee";
import * as adminUserData from "../../fixtures/adminUserData.json";

describe("Show reviews in Homepage", () => {
  it("Verify user is not able to click on the Show reviews button before selecting the entity", () => {
    cy.visit("/");
    loginPage.doLogin(
      adminUserData.cypressAutomationUserEmail,
      adminUserData.genericPassword
    );
    homeEmployeePage.assertShowReviewsButtonIsDisabled();
  });

  it("Verify user is able to click on the Show reviews button after selecting the entity", () => {
    cy.visit("/");
    loginPage.doLogin(
      adminUserData.cypressAutomationUserEmail,
      adminUserData.genericPassword
    );

    homeEmployeePage.selectOffice("Blue-Office Resen");
    cy.assertLoadingDotsNotVisible();
    homeEmployeePage.filterByAvailability("Available");
    homeEmployeePage.selectDeskN(1);

    homeEmployeePage.clickShowReviewsButton();
    homeEmployeePage.assertModalIsDisplayed();
  });

  it("Verify clicking OK button closes the modal", () => {
    cy.visit("/");
    loginPage.doLogin(
      adminUserData.cypressAutomationUserEmail,
      adminUserData.genericPassword
    );

    homeEmployeePage.selectOffice("Blue-Office Resen");
    cy.assertLoadingDotsNotVisible();
    homeEmployeePage.filterByAvailability("Available");
    homeEmployeePage.selectDeskN(1);

    homeEmployeePage.clickShowReviewsButton();
    homeEmployeePage.clickModalOkButton();
    homeEmployeePage.assertModalIsNotDisplayed();
  });

  // https://dev.azure.com/ITLabs-LLC/Internship%202022/_workitems/edit/53150/
  // TODO: Delete skip once bug is fixed and verified.
  it.skip("Verify clicking outside the modal closes it", () => {
    cy.visit("/");
    loginPage.doLogin(
      adminUserData.cypressAutomationUserEmail,
      adminUserData.genericPassword
    );

    homeEmployeePage.selectOffice("Blue-Office Resen");
    cy.assertLoadingDotsNotVisible();
    homeEmployeePage.filterByAvailability("Available");
    homeEmployeePage.selectDeskN(1);

    homeEmployeePage.clickShowReviewsButton();
    cy.clickOnScreenPosition("topLeft");
    homeEmployeePage.assertModalIsNotDisplayed();
  });
});
