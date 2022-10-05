import { loginPage } from '../../support/pages/login';
import { registerPage } from '../../support/pages/register';
import * as userData from '../../fixtures/userData.json';

describe('Register form validations', () => {

  const EMAIL_ADDRESS = 'random-email@it-labs.com';

  it('Verifies Password and Confirm Password fields are masked', () => {
    cy.visit('/');
    loginPage.clickRegisterButton();
    registerPage.enterPassword(userData.genericPassword);
    registerPage.enterConfirmationPassword(userData.genericPassword);
    registerPage.assertPasswordFieldIsMasked();
    registerPage.assertPasswordFieldIsMasked();
    registerPage.showPasswords();
    registerPage.assertPasswordFieldIsNotMasked();
    registerPage.assertPasswordFieldIsNotMasked();
  });

  it('Verifies User is not able to register if Email is missing', () => {
    cy.visit('/');
    loginPage.clickRegisterButton();
    registerPage.enterFirstName();
    registerPage.enterLastName();
    registerPage.enterJobTitle();
    registerPage.enterPassword();
    registerPage.enterConfirmationPassword();
    registerPage.clickRegisterSubmitButton();
    registerPage.assertEmailInputIsFocused();
  });

  it('Verifies User is not able to register if First Name is missing', () => {
    cy.visit('/');
    loginPage.clickRegisterButton();
    registerPage.enterEmailAddress(EMAIL_ADDRESS);
    registerPage.enterLastName();
    registerPage.enterJobTitle();
    registerPage.enterPassword();
    registerPage.enterConfirmationPassword();
    registerPage.clickRegisterSubmitButton();
    registerPage.assertFirstNameInputIsFocused();
  });

  it('Verifies User is not able to register if Last Name is missing', () => {
    cy.visit('/');
    loginPage.clickRegisterButton();
    registerPage.enterEmailAddress(EMAIL_ADDRESS);
    registerPage.enterFirstName();
    registerPage.enterJobTitle();
    registerPage.enterPassword();
    registerPage.enterConfirmationPassword();
    registerPage.clickRegisterSubmitButton();
    registerPage.assertLastNameInputIsFocused();
  });

  it('Verifies User is not able to register if Job Title is missing', () => {
    cy.visit('/');
    loginPage.clickRegisterButton();
    registerPage.enterEmailAddress(EMAIL_ADDRESS);
    registerPage.enterFirstName();
    registerPage.enterLastName();
    registerPage.enterPassword();
    registerPage.enterConfirmationPassword();
    registerPage.clickRegisterSubmitButton();
    registerPage.assertJobTitleInputIsFocused();
  });

  it('Verifies User is not able to register if Password is missing', () => {
    cy.visit('/');
    loginPage.clickRegisterButton();
    registerPage.enterEmailAddress(EMAIL_ADDRESS);
    registerPage.enterFirstName();
    registerPage.enterLastName();
    registerPage.enterJobTitle();
    registerPage.enterConfirmationPassword();
    registerPage.clickRegisterSubmitButton();
    registerPage.assertPasswordInputIsFocused();
  });

  it('Verifies User is not able to register if Confirmation Password is missing', () => {
    cy.visit('/');
    loginPage.clickRegisterButton();
    registerPage.enterEmailAddress(EMAIL_ADDRESS);
    registerPage.enterFirstName();
    registerPage.enterLastName();
    registerPage.enterJobTitle();
    registerPage.enterPassword();
    registerPage.clickRegisterSubmitButton();
    registerPage.assertConfirmationPasswordInputIsFocused();
  });

  it('Verifies User is not able to register if Confirmation Password is missing', () => {
    cy.visit('/');
    loginPage.clickRegisterButton();

    registerPage.enterFirstName();
    registerPage.enterLastName();
    registerPage.enterJobTitle();
    registerPage.enterPassword();
    registerPage.enterConfirmationPassword();

    // verify invalid email with special character
    registerPage.enterEmailAddress('$email@it-labs.com');
    registerPage.clickRegisterSubmitButton();
    registerPage.assertRegistrationErrorMessageIsDisplayed();
    registerPage.closeErrorPopUp();

    // verify invalid email without username part
    registerPage.enterEmailAddress('@it-labs.com');
    registerPage.clickRegisterSubmitButton();
    registerPage.assertRegistrationErrorMessageIsDisplayed();
    registerPage.closeErrorPopUp();

    // verify invalid email without domain part
    registerPage.enterEmailAddress('email-without-domain');
    registerPage.clickRegisterSubmitButton();
    registerPage.assertRegistrationErrorMessageIsDisplayed();
    registerPage.closeErrorPopUp();

    // verify empty email
    registerPage.enterEmailAddress(' ');
    registerPage.clickRegisterSubmitButton();
    registerPage.assertRegistrationErrorMessageIsDisplayed();
  });

  it('Verifies User is not able to register with Password less than 8 or more than 20 characters', () => {
    cy.visit('/');
    loginPage.clickRegisterButton();
    registerPage.enterEmailAddress(EMAIL_ADDRESS);
    registerPage.enterFirstName();
    registerPage.enterLastName();
    registerPage.enterJobTitle();

    // verify password with less than 8 characters
    registerPage.enterPassword('7Chars#');
    registerPage.enterConfirmationPassword('7Chars#');
    registerPage.clickRegisterSubmitButton();
    // TODO: Change this assertion to assertPasswordErrorMessageIsDisplayed() once error handling is fixed
    registerPage.assertRegistrationErrorMessageIsDisplayed();
    registerPage.closeErrorPopUp();

    // verify password with more than 20 characters
    registerPage.enterPassword('1234567_21Characters#');
    registerPage.enterConfirmationPassword('1234567_21Characters#');
    registerPage.clickRegisterSubmitButton();
    // TODO: Change this assertion to assertPasswordErrorMessageIsDisplayed() once error handling is fixed.
    registerPage.assertRegistrationErrorMessageIsDisplayed();
  });

  it('Verifies User is not able to register if Password and Confirmation Password do not match', () => {
    cy.visit('/');
    loginPage.clickRegisterButton();
    registerPage.enterEmailAddress(EMAIL_ADDRESS);
    registerPage.enterFirstName();
    registerPage.enterLastName();
    registerPage.enterJobTitle();

    registerPage.enterPassword('MyPassword##');
    registerPage.enterConfirmationPassword('MyPassword$$');
    registerPage.clickRegisterSubmitButton();
    registerPage.assertPasswordsDontMatchAlert();
  });
});
