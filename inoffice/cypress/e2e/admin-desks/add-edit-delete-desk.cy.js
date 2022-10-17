import { loginPage } from "../../support/pages/login";
import * as userData from "../../fixtures/userData.json";
import * as urlSlugs from "../../fixtures/urlSlugs.json";
import * as officesData from "../../fixtures/officesData.json";
import { addEditDeleteDeskPage } from "../../support/pages/add-edit-delete-desk";


it('Verify the admin can add new desks', () =>{
    cy.visit("/");
    loginPage.doLogin(
      userData.cypressAutomationUserEmail,
      userData.genericPassword
    );
    cy.url().should("contain", urlSlugs.employee + urlSlugs.home);
    cy.visit(urlSlugs.admin + urlSlugs.offices);
    cy.contains('Edit').click();
    addEditDeleteDeskPage.addNewDesks();
    addEditDeleteDeskPage.verifySuccessfullyAddedNewEntitiesMessage(); 
})

 it('Verify the admin can edit desks', () =>{
  cy.visit("/");
  loginPage.doLogin(
    userData.cypressAutomationUserEmail,
    userData.genericPassword
  );
  cy.url().should("contain", urlSlugs.employee + urlSlugs.home);
  cy.visit(urlSlugs.admin + urlSlugs.offices);
  cy.contains('Edit').click();
  //UNAVAILABLE
  addEditDeleteDeskPage.selectDeskUnavaliable();
  addEditDeleteDeskPage.unselectDeskUnavailable();
  //SINGLE MONITOR
  addEditDeleteDeskPage.selectDeskSingleMonitor();
  addEditDeleteDeskPage.unselectDeskSingleMonitor();
  //DUAL MONITOR
  addEditDeleteDeskPage.selectDeskDualMonitor();
  addEditDeleteDeskPage.unselectDeskDualMonitor();
  //NEAR WINDOW
  addEditDeleteDeskPage.selectDeskNearWindow();
  addEditDeleteDeskPage.unselectDeskNearWindow();
 })
 
 it('Verify the admin can delete desks', () =>{
  cy.visit("/");
  loginPage.doLogin(
    userData.cypressAutomationUserEmail,
    userData.genericPassword
  );
  cy.url().should("contain", urlSlugs.employee + urlSlugs.home);
  cy.visit(urlSlugs.admin + urlSlugs.offices);
  cy.contains('Edit').click();
  addEditDeleteDeskPage.deleteDesk();
  addEditDeleteDeskPage.verifySucessfullyDeletedEntityMessage();
 })


