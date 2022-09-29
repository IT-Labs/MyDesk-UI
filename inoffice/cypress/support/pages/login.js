export class LoginPage {

  /**
   * Locators.
   */
  emailInput() {
    return cy.get('[data-cy=login-email-input]');
  }

  passwordInput() {
    return cy.get('[data-cy=login-password-input]');
  }

  submitButton() {
    return cy.get('[data-cy=login-cta-button]');
  }

  incorrectCredentialsMessage() {
    return cy.get('[data-cy=login-incorrect-credentials-message]');
  }

  registerButton() {
    return cy.get('[data-cy=register-button]');
  }

  /**
   * Methods.
   */
  doLogin(email, password) {
    this.emailInput().type(email);
    this.passwordInput().type(password);
    this.clickSubmitButton();
  }

  clickSubmitButton() {
    this.submitButton().click();
  }

  verifyIncorrectCredentialsMessageIsDisplayed() {
    this.incorrectCredentialsMessage().
        should('have.text', 'The password or email that you\'ve entered is incorrect. Please try again.').
        and('be.visible');
  }

  clickRegisterButton() {
    this.registerButton().click();
  }
}

export const loginPage = new LoginPage();
