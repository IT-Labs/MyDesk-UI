export class AddEditDeleteDeskPage {
  /**
   * Locators.
   */

  inputNumberOfDesksField() {
    return cy.get('[data-cy="input-numberofdesks"]');
  }

  addNewEntitiesButton() {
    return cy.get('[data-cy="button-addentities"]');
  }

  successfullyAddedNewEntitiesMessage() {
    return cy.contains('You have successfully added new entities');
  }

  unavaliableCheckbox() {
    return cy.get('[data-cy="checkbox-unavailable"]');
  }

  singleMonitorCheckbox() {
    return cy.get('[data-cy="checkbox-1monitor"]');
  }

  dualMonitorCheckbox() {
    return cy.get('[data-cy="checkbox-2monitor"]');
  }

  nearWindowCheckbox() {
    return cy.get('[data-cy="checkbox-nearwindow"]');
  }

  deleteDeskButton() {
    return cy.get('[data-cy="delete-desk"]');
  }

  okBtnDeleteDesk() {
    return cy.contains('OK').click({force: true});
  }

  sucessfullyDeletedMessage() {
    return cy.contains('You have successfully deleted the entity');
  }


  /**
   * Methods.
   */
 
  addNewDesks() {
    this.inputNumberOfDesksField().type("1");
    this.addNewEntitiesButton().click();
  }

  verifySuccessfullyAddedNewEntitiesMessage() {
    this.successfullyAddedNewEntitiesMessage();
  }

  selectDeskUnavaliable() {
    this.unavaliableCheckbox().check();
    this.unavaliableCheckbox().should('be.checked');
  }

  unselectDeskUnavailable() {
    this.unavaliableCheckbox().uncheck();
    this.unavaliableCheckbox().should('not.be.checked');
  }

  selectDeskSingleMonitor() {
    this.singleMonitorCheckbox().check();
    this.singleMonitorCheckbox().should('be.checked');
  }

  unselectDeskSingleMonitor() {
    this.singleMonitorCheckbox().uncheck();
    this.singleMonitorCheckbox().should('not.be.checked');
  }

  selectDeskDualMonitor() {
    this.dualMonitorCheckbox().check();
    this.dualMonitorCheckbox().should('be.checked');
  }

  unselectDeskDualMonitor() {
    this.dualMonitorCheckbox().uncheck();
    this.dualMonitorCheckbox().should('not.be.checked');
  }

  selectDeskNearWindow() {
    this.nearWindowCheckbox().check();
    this.nearWindowCheckbox().should('be.checked');
  }

  unselectDeskNearWindow() {
    this.nearWindowCheckbox().uncheck();
    this.nearWindowCheckbox().should('not.be.checked');
  }

  deleteDesk() {
    this.deleteDeskButton().click({ multiple: true });
    this.okBtnDeleteDesk().click({force: true});
  }
  verifySucessfullyDeletedEntityMessage() {
    this.sucessfullyDeletedMessage();
  }
}

export const addEditDeleteDeskPage = new AddEditDeleteDeskPage();