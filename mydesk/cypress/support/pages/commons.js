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

  adminPagesTitle() {
    return cy.get(".ant-card-head-title p");
  }

  /**
   * Methods.
   */

  assertTitleInAdminPages(pageName) {
    this.adminPagesTitle().should("have.text", pageName).and("be.visible");
  }
}

export const commonsPage = new CommonsPage();
