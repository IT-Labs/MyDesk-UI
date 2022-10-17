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
}

export const employeeReservationsPage = new EmployeeReservationsPage();
