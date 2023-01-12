import { commonsPage } from "../pages/commons";

export class AdminReservationsPage {
  /**
   * Locators.
   */

  officeBranchFilterDropdown() {
    return cy.get("[data-cy=office-branch-select] .ant-select-selector");
  }

  officeBranchFilterInput() {
    return cy.get('input[type="search"]');
  }

  officeDropdownAllOptions() {
    return cy.get(
      ".rc-virtual-list-holder-inner .ant-select-item.ant-select-item-option"
    );
  }

  selectedOfficeLabel() {
    return cy.get(".ant-select-selection-item");
  }

  myReservationsTableBody() {
    return cy.get(".ant-table-tbody");
  }

  searchByNameInput() {
    return cy.get("[data-cy=search-by-name-input]");
  }

  reservationsListTableBody() {
    return cy.get(".ant-table-tbody");
  }

  /**
   * Methods.
   */

  getOfficesListInReservations() {
    this.officeBranchFilterDropdown().click({ force: true });
    this.officeDropdownAllOptions().then(($officesInReservations) => {
      Cypress.env("officesInReservations", $officesInReservations);
    });
  }

  assertOfficesAreTheSameAsHomepage() {
    expect(Cypress.env("officesInHomepage")).to.deep.equal(
      Cypress.env("officesInReservations")
    );
  }

  assertOfficeIsFiltered(officeName) {
    this.officeBranchFilterDropdown().click({ force: true });
    this.officeBranchFilterInput().type(`${officeName}{enter}`, {
      force: true,
    });
    this.selectedOfficeLabel().should("have.text", officeName);

    this.myReservationsTableBody()
      .find("tr.ant-table-row.ant-table-row-level-0")
      .each(($tr) => {
        cy.get($tr)
          .find("td")
          .each(($td, $index) => {
            if ($index == 1) expect($td).to.have.text(officeName); //  index 1 = office name
          });
      });
  }

  assertUserIsFiltered(coworkerName) {
    this.searchByNameInput().type(coworkerName);
    this.myReservationsTableBody()
      .find("tr.ant-table-row.ant-table-row-level-0")
      .each(($tr) => {
        cy.get($tr)
          .find("td")
          .each(($td, $index) => {
            if ($index == 0) expect($td).to.contain.text(coworkerName); //  index 0 = user name
          });
      });
  }

  cancelTheFirstReservationInTheList() {
    this.reservationsListTableBody()
      .find("tr")
      .first()
      .find("td:nth-child(5)")
      .find("button")
      .click();
    this.confirmReservationCancellation();
  }

  confirmReservationCancellation() {
    commonsPage
      .confirmationModalTitle()
      .should("have.text", "Cancel user's reservation?");
    commonsPage
      .confirmationModalMessage()
      .should("have.text", "Do you really want to cancel this reservation?");
    commonsPage.confirmationModalOkButton().click();
  }

  verifyCancellationIsSuccessful() {
    commonsPage
      .notificationModalMessageLabel()
      .should("have.text", "Notification");
    commonsPage
      .notificationModalDescriptionLabel()
      .should("have.text", "You have successfully cancelled the reservation");
  }

  verifyAdminCanCancelReservations() {
    this.cancelTheFirstReservationInTheList();
    this.verifyCancellationIsSuccessful();
  }
}

export const adminReservationsPage = new AdminReservationsPage();
