export class LoginPage {
  /**
   * Locators.
   */
  emailInput() {
    return cy.get("[data-cy=login-email-input]");
  }

  passwordInput() {
    return cy.get("[data-cy=login-password-input]");
  }

  submitButton() {
    return cy.get("[data-cy=login-cta-button]");
  }

  registerButton() {
    return cy.get("[data-cy=register-cta-button]");
  }

  incorrectCredentialsMessage() {
    return cy.get("[data-cy=login-incorrect-credentials-message]");
  }

  showPasswordButton() {
    return cy.get(".ant-input-password-icon");
  }

  /**
   * Methods.
   */
  doLogin(email, password) {
    this.emailInput().type(email);
    this.passwordInput().type(password);
    this.clickSubmitButton();
  }

  doLoginWithEnter(email, password) {
    this.emailInput().type(email);
    this.passwordInput().type(`${password}{enter}`);
  }

  clickSubmitButton() {
    this.submitButton().click();
  }

  verifyIncorrectCredentialsMessageIsDisplayed() {
    this.incorrectCredentialsMessage()
      .should(
        "have.text",
        "The password or email that you've entered is incorrect. Please try again."
      )
      .and("be.visible");
  }

  assertPasswordInputIsMasked(password) {
    this.passwordInput().type(password);
    this.passwordInput()
      .should("have.value", password)
      .should("have.attr", "type", "password");
  }

  clickSubmitShowPasswordButton() {
    this.showPasswordButton().click();
  }

  assertPasswordInputIsNotMasked(password) {
    this.passwordInput().clear().type(password);
    this.passwordInput()
      .should("have.value", password)
      .should("have.attr", "type", "text");
  }

  assertRegisterButtonDoesntExist() {
    this.registerButton().should("not.exist");
  }

  assertLoginPageLinkDoesntExist() {
    cy.get(`a[href="/"]`).should("not.exist");
  }
}

export const loginPage = new LoginPage();
