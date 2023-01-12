export class CommonsPage {
  /**
   * Locators.
   */
  confirmationModalTitle() {
    return cy.get(".ant-modal-header .ant-modal-title");
  }

  confirmationModalMessage() {
    return cy.get(".ant-modal-body");
  }

  confirmationModalOkButton() {
    return cy.get(".ant-modal-footer .ant-btn-primary");
  }

  confirmationModalCancelButton() {
    return cy.get(".ant-modal-footer .ant-btn-default");
  }

  notificationModalMessageLabel() {
    return cy.get(".ant-notification-notice-message");
  }

  notificationModalDescriptionLabel() {
    return cy.get(".ant-notification-notice-description");
  }

  accessDeniedMessage() {
    return cy.get(".acccess-denied-wrap h1");
  }

  /**
   * Methods.
   */

  verifyAccessDeniedMessageIsDisplayed() {
    this.accessDeniedMessage()
      .should(
        "have.text",
        "401: Sorry, You Are Not Allowed to Access This Page"
      )
      .and("be.visible");
  }
}

export const commonsPage = new CommonsPage();
