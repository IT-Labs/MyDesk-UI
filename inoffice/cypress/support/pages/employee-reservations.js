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

  selectedOfficeLabel() {
    return cy.get(".ant-select-selection-item");
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

  assertOfficeIsFiltered() {
    this.officeBranchFilterDropdown().click({ force: true });
    this.officeBranchFilterInput().type(`Cypress.env("default_office"){enter}`);
    this.selectedOfficeLabel().should(
      "have.text",
      Cypress.env("default_office")
    );
  }
}

export const employeeReservationsPage = new EmployeeReservationsPage();
