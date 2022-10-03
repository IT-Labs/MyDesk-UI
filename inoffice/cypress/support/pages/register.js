import * as userData from '../../fixtures/userData.json';

export class RegisterPage {

  /**
   * Locators.
   */
  createYourAccountLabel() {
    return cy.get('[data-cy=create-your-account-label]');
  }

  emailInput() {
    return cy.get('[data-cy=register-email-input]');
  }

  firstNameInput() {
    return cy.get('[data-cy=register-firstname-input]');
  }

  lastNameInput() {
    return cy.get('[data-cy=register-lastname-input]');
  }

  jobTitleInput() {
    return cy.get('[data-cy=register-jobtitle-input]');
  }

  passwordInputField() {
    return cy.get('[data-cy=password-input]');
  }

  passwordConfirmInputField() {
    return cy.get('[data-cy=password-confirm-input]');
  }

  passwordEyeIcon() {
    return cy.get('[data-icon=eye-invisible]');
  }

  registerSubmitButton() {
    return cy.get('[data-cy=register-submit-button]');
  }

  popUpContent() {
    return cy.get('[class*=ant-notification-notice-content]');
  }

  popUpCloseButton() {
    return cy.get('[class*=anticon-close]');
  }

  passwordsDontMatchAlert() {
    return cy.get('[data-cy=password-not-matching-alert]');
  }

  /**
   * Methods.
   */
  assertCreateYourAccountLabelIsDisplayed(email, password) {
    this.createYourAccountLabel().should('have.text', 'Create your account').and('be.visible');
  }

  enterEmailAddress(email) {
    this.emailInput().clear().type(email);
  }

  enterFirstName(firstName = 'First name') {
    this.firstNameInput().type(firstName);
  }

  enterLastName(lastName = 'Last name') {
    this.lastNameInput().type(lastName);
  }

  enterJobTitle(jobTitle = 'Job title') {
    this.jobTitleInput().type(jobTitle);
  }

  enterPassword(password = userData.genericPassword) {
    this.passwordInputField().clear().type(password);
  }

  enterConfirmationPassword(password = userData.genericPassword) {
    this.passwordConfirmInputField().clear().type(password);
  }

  clickRegisterSubmitButton() {
    this.registerSubmitButton().click();
  }

  assertPasswordFieldIsMasked() {
    this.passwordInputField().should('have.attr', 'type', 'password');
  }

  assertConfirmPasswordFieldIsMasked() {
    this.passwordConfirmInputField().should('have.attr', 'type', 'password');
  }

  showPasswords() {
    this.passwordEyeIcon().click({ multiple: true });
  }

  assertPasswordFieldIsNotMasked() {
    this.passwordInputField().should('have.attr', 'type', 'text');
  }

  assertConfirmPasswordFieldIsNotMasked() {
    this.passwordConfirmInputField().should('have.attr', 'type', 'text');
  }

  populateRegisterForm(
      email, firstName = 'First name', lastName = 'Last name', jobTitle = 'Job title', password = 'TestPassword123!',
      confirmationPassword = 'TestPassword123!') {
    this.enterEmailAddress(email);
    this.enterFirstName(firstName);
    this.enterLastName(lastName);
    this.enterJobTitle(jobTitle);
    this.enterPassword(password);
    this.enterConfirmationPassword(confirmationPassword);
  }

  assertEmailInputIsFocused() {
    this.emailInput().should('be.focused');
  }

  assertFirstNameInputIsFocused() {
    this.firstNameInput().should('be.focused');
  }

  assertLastNameInputIsFocused() {
    this.lastNameInput().should('be.focused');
  }

  assertJobTitleInputIsFocused() {
    this.jobTitleInput().should('be.focused');
  }

  assertPasswordInputIsFocused() {
    this.passwordInputField().should('be.focused');
  }

  assertConfirmationPasswordInputIsFocused() {
    this.passwordConfirmInputField().should('be.focused');
  }

  assertRegistrationErrorMessageIsDisplayed() {
    this.popUpContent().should('contain', 'Registration failed.').should('be.visible');
  }

  closeErrorPopUp() {
    this.popUpCloseButton().click({ multiple: true });
  }

  assertPasswordErrorMessageIsDisplayed() {
    this.popUpContent().
        should('contain',
            'Password must contain between 8 and 20 characters, at least one upper character, one lower case character, one special character, and one number.').
        should('be.visible');
  }

  assertPasswordsDontMatchAlert() {
    this.passwordsDontMatchAlert().should('have.text', 'Password didn\'t match! Try again.').and('be.visible');
  }

  verifyCreateYourAccountLable() {
    this.createYourAccountLabel().
    should('have.text','Create your account').
    and('be.visible');
  }

  verifyRegisterFormIsVisible() {
    this.emailInput().
    should('be.visible');
    this.emailInput().
    should('be.visible');
    this.firstNameInput().
    should('be.visible'); 
    this.lastNameInput(). 
    should('be.visible');
    this.jobTitleInput(). 
    should('be.visible');
    this.passwordInputField(). 
    should('be.visible');
    this.passwordConfirmInputField().
    should('be.visible'); 
  }

  verifyRegisterButton() {
    this.registerSubmitButton().
    should('be.visible');
  }
}

export const registerPage = new RegisterPage();
