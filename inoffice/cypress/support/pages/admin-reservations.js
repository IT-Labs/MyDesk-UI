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
}

export const adminReservationsPage = new AdminReservationsPage();
