export class HomeEmployeePage {
  
  /**
   * Locators.
   */
  userHeaderLink() {
    return cy.get('[data-cy=user-header-link]');
  }

  logoutButton() {
    return cy.get('[data-cy=logout-button]');
  }

  /**
   * Methods.
   */
  assertUserNameInHeader(userFullName) {
    this.userHeaderLink().should('have.text', userFullName).and('be.visible');
  }

  clickLogoutButton() {
    this.logoutButton().click();
  }
}

export const homeEmployeePage = new HomeEmployeePage();
