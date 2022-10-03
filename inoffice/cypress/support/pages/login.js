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

  microsoftSSOButton() {
    return cy.get('[data-cy="login-microsoftssobtn-button"]');
  }

  welcomeBackText() {
    return cy.get('[data-cy="login-logo-welcomebacktext"]');
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

  verifyPresenceOfMicrosoftSSOButton() {
    this.microsoftSSOButton().
    should('be.visible');
  }

  verifyWelcomeBackText() {
    this.welcomeBackText().
    should('have.text','Welcome back! Please log in to continue').
    and('be.visible');
  }

  verifyLoginPageTitle() {
    cy.title().
    should('include','inOffice')
  }
}

export const loginPage = new LoginPage();
