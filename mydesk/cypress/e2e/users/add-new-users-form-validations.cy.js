import { commonsPage } from "../../support/pages/commons";
import { loginPage } from "../../support/pages/login";
import { homeEmployeePage } from "../../support/pages/home-employee";
import { usersManagementPage } from "../../support/pages/users-management";

import * as urlSlugs from "../../fixtures/urlSlugs.json";
import * as adminUserData from "../../fixtures/adminUserData.json";

describe("Verify an admin user can add new users", () => {
  const EMAIL_ADDRESS = "random-email@it-labs.com";

  before(() => {
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
  });

  beforeEach(() => {
    usersManagementPage.clickAddNewUserButton();
  });

  afterEach(() => {
    usersManagementPage.closeAddUserModalForm();
  });

  it("Verifies User is not able to register if Email is missing", () => {
    usersManagementPage.enterFirstName();
    usersManagementPage.enterLastName();
    usersManagementPage.enterJobTitle();
    usersManagementPage.enterPassword();
    usersManagementPage.enterConfirmationPassword();
    usersManagementPage.clickRegisterSubmitButton();
    usersManagementPage.assertEmailInputIsFocused();
  });

  it("Verifies User is not able to register if First Name is missing", () => {
    usersManagementPage.enterEmailAddress(EMAIL_ADDRESS);
    usersManagementPage.enterLastName();
    usersManagementPage.enterJobTitle();
    usersManagementPage.enterPassword();
    usersManagementPage.enterConfirmationPassword();
    usersManagementPage.clickRegisterSubmitButton();
    usersManagementPage.assertFirstNameInputIsFocused();
  });

  it("Verifies User is not able to register if Last Name is missing", () => {
    usersManagementPage.enterEmailAddress(EMAIL_ADDRESS);
    usersManagementPage.enterFirstName();
    usersManagementPage.enterJobTitle();
    usersManagementPage.enterPassword();
    usersManagementPage.enterConfirmationPassword();
    usersManagementPage.clickRegisterSubmitButton();
    usersManagementPage.assertLastNameInputIsFocused();
  });

  // TODO: remove, Job title is not mandatory anymore
  it.skip("Verifies User is not able to register if Job Title is missing", () => {
    usersManagementPage.enterEmailAddress(EMAIL_ADDRESS);
    usersManagementPage.enterFirstName();
    usersManagementPage.enterLastName();
    usersManagementPage.enterPassword();
    usersManagementPage.enterConfirmationPassword();
    usersManagementPage.clickRegisterSubmitButton();
    usersManagementPage.assertJobTitleInputIsFocused();
  });

  it("Verifies User is not able to register if Password is missing", () => {
    usersManagementPage.enterEmailAddress(EMAIL_ADDRESS);
    usersManagementPage.enterFirstName();
    usersManagementPage.enterLastName();
    usersManagementPage.enterJobTitle();
    usersManagementPage.enterConfirmationPassword();
    usersManagementPage.clickRegisterSubmitButton();
    usersManagementPage.assertPasswordInputIsFocused();
  });

  it("Verifies User is not able to register if Confirmation Password is missing", () => {
    usersManagementPage.enterEmailAddress(EMAIL_ADDRESS);
    usersManagementPage.enterFirstName();
    usersManagementPage.enterLastName();
    usersManagementPage.enterJobTitle();
    usersManagementPage.enterPassword();
    usersManagementPage.clickRegisterSubmitButton();
    usersManagementPage.assertConfirmationPasswordInputIsFocused();
  });

  // TODO: activate it when fix is done https://dev.azure.com/ITLabs-LLC/Internship%202022/_workitems/edit/76864
  it.skip("Verifies User is not able to register with invalid email addresses", () => {
    usersManagementPage.enterFirstName();
    usersManagementPage.enterLastName();
    usersManagementPage.enterJobTitle();
    usersManagementPage.enterPassword();
    usersManagementPage.enterConfirmationPassword();

    // verify invalid email with special character
    usersManagementPage.enterEmailAddress("$email@it-labs.com");
    usersManagementPage.clickRegisterSubmitButton();
    usersManagementPage.assertRegistrationErrorMessageIsDisplayed();
    usersManagementPage.closeErrorPopUp();

    // verify invalid email without username part
    usersManagementPage.enterEmailAddress("@it-labs.com");
    usersManagementPage.clickRegisterSubmitButton();
    usersManagementPage.assertRegistrationErrorMessageIsDisplayed();
    usersManagementPage.closeErrorPopUp();

    // verify invalid email without domain part
    usersManagementPage.enterEmailAddress("email-without-domain");
    usersManagementPage.clickRegisterSubmitButton();
    usersManagementPage.assertRegistrationErrorMessageIsDisplayed();
    usersManagementPage.closeErrorPopUp();

    // verify empty email
    usersManagementPage.enterEmailAddress(" ");
    usersManagementPage.clickRegisterSubmitButton();
    usersManagementPage.assertRegistrationErrorMessageIsDisplayed();
  });

  // TODO: activate it when fix is done https://dev.azure.com/ITLabs-LLC/Internship%202022/_workitems/edit/76865
  it.skip("Verifies User is not able to register with Password less than 8 or more than 20 characters", () => {
    usersManagementPage.enterEmailAddress(EMAIL_ADDRESS);
    usersManagementPage.enterFirstName();
    usersManagementPage.enterLastName();
    usersManagementPage.enterJobTitle();

    // verify password with less than 8 characters
    usersManagementPage.enterPassword("7Chars#");
    usersManagementPage.enterConfirmationPassword("7Chars#");
    usersManagementPage.clickRegisterSubmitButton();
    // TODO: Change this assertion to assertPasswordErrorMessageIsDisplayed() once error handling is fixed
    usersManagementPage.assertRegistrationErrorMessageIsDisplayed();
    usersManagementPage.closeErrorPopUp();

    // verify password with more than 20 characters
    usersManagementPage.enterPassword("1234567_21Characters#");
    usersManagementPage.enterConfirmationPassword("1234567_21Characters#");
    usersManagementPage.clickRegisterSubmitButton();
    // TODO: Change this assertion to assertPasswordErrorMessageIsDisplayed() once error handling is fixed.
    usersManagementPage.assertRegistrationErrorMessageIsDisplayed();
  });

  it("Verifies User is not able to register if Password and Confirmation Password do not match", () => {
    usersManagementPage.enterEmailAddress(EMAIL_ADDRESS);
    usersManagementPage.enterFirstName();
    usersManagementPage.enterLastName();
    usersManagementPage.enterJobTitle();

    usersManagementPage.enterPassword("MyPassword##");
    usersManagementPage.enterConfirmationPassword("MyPassword$$");
    usersManagementPage.clickRegisterSubmitButton();
    usersManagementPage.assertPasswordsDontMatchAlert();
  });
});
