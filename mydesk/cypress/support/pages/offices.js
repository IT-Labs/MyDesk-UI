export class OfficesPage {
  /**
   * Locators.
   */

  searchOfficeField() {
    return cy.get('[data-cy="SearchOffice-Input"]');
  }

  deleteOfficeButton() {
    return cy.get('[data-cy="deleteoffice-button"]');
  }

  editOfficeButton() {
    return cy.get('[data-cy="editoffice-button"]');
  }

  addNewOfficeButton() {
    return cy.get('[data-cy="addoffice-button"]');
  }

  officeNameField() {
    return cy.get('[data-cy="officename-input"]');
  }

  officeLocationField() {
    return cy.get('[data-cy="officelocation-input"]');
  }

  saveNewOfficeButton() {
    return cy.get('[data-cy="saveoffice-button"]');
  }

  /**
   * Methods.
   */

  searchOffice(office) {
    this.searchOfficeField().clear().type(office);
  }

  deleteOffice() {
    this.deleteOfficeButton().click();
    cy.contains("Yes").click();
  }

  verifySuccessfullyDeletedOfficeMessage() {
    cy.contains("You have successfully deleted the selected office").should(
      "be.visible"
    );
  }

  verifySuccessfullyAddedNewOfficeMessage() {
    cy.contains("You have successfully added a new office").should(
      "be.visible"
    );
  }

  editOffice() {
    this.editOfficeButton().click();
  }

  addNewOffice(officeName, officeLocation) {
    this.addNewOfficeButton().click();
    this.officeNameField().type(officeName);
    this.officeLocationField().type(officeLocation);
    this.saveNewOfficeButton().click();
    cy.wait(3000);
    //this.verifySuccessfullyAddedNewOfficeMessage();
  }
}

export const officesPage = new OfficesPage();
