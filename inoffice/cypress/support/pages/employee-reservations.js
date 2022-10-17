import moment from "moment";

export class EmployeeReservationsPage {
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

  modalContainer() {
    return cy.get('[data-cy="modal-container"]');
  }

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
    this.officeBranchFilterInput().type(`${officeName}{enter}`);
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

  getMyFutureReservationsUI() {
    this.myReservationsTableBody()
      .find("tr.ant-table-row.ant-table-row-level-0")
      .as("myFutureReservationsUI");
  }

  verifyMyFutureReservationsAreShown() {
    this.getMyFutureReservationsUI();
    cy.getEmployeeFutureReservationsAPI();
    cy.get("@myFutureReservationsAPI").each(($tr, $index) => {
      cy.get("@myFutureReservationsUI").each(($trUI, $indexUI) => {
        // getting sure we are applying the assertions in the right object index
        if ($index == $indexUI) {
          // dates
          expect($trUI.find("td:nth-child(1)")).to.have.text(
            `${moment($tr["startDate"]).format("DD/MM/YYYY")} - ${moment(
              $tr["endDate"]
            ).format("DD/MM/YYYY")}`
          );
          // office name
          expect($trUI.find("td:nth-child(2)")).to.have.text(
            $tr["desk"]["office"]["name"]
          );
          // desk Number
          expect($trUI.find("td:nth-child(3)")).to.have.text(
            `Desk [${$tr["desk"]["indexForOffice"]}]`
          );
          // button Cancel
          expect($trUI.find("td:nth-child(4)").find("button")).to.have.text(
            `Cancel`
          );
        }
      });
    });
  }

  verifyThereIsAtLeastOneReservedDesk() {
    this.getMyFutureReservationsUI();
    cy.get("@myFutureReservationsUI").should("not.be.empty");
  }

  confirmReserveCancellation() {
    this.confirmationModalTitle().should(
      "have.text",
      "Are you sure you want to cancel your reservation?"
    );
    this.confirmationModalMessage().should(
      "have.text",
      `You are able to reserve your seat again but someone can reserve it before you.`
    );
    this.confirmationModalOkButton().click();
  }

  verifyCancellationIsSuccessful() {
    this.notificationModalMessageLabel().should("have.text", "Notification");
    this.notificationModalDescriptionLabel().should(
      "have.text",
      "You have successfully cancelled a reservation"
    );
  }

  cancelMyReservation() {
    cy.get("@myFutureReservationsUI")
      .last()
      .find("td:nth-child(4)")
      .find("button")
      .click();
    this.confirmReserveCancellation();
  }
}

export const employeeReservationsPage = new EmployeeReservationsPage();
