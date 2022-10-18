import { loginPage } from "../../support/pages/login";
import * as userData from "../../fixtures/userData.json";
import * as urlSlugs from "../../fixtures/urlSlugs.json";
import { addEditDeleteDeskPage } from "../../support/pages/add-edit-delete-desk";
import { officesPage} from "../../support/pages/offices";


it('Create Test Office API', () =>{
  cy.visit("/");
  loginPage.doLogin(
   userData.cypressAutomationUserEmail,
   userData.genericPassword);
  cy.createOfficeApi(userData.cypressAutomationUserEmail,
    userData.genericPassword,
    '1Test',
    'Office');
  })

it('Create Test Office UI', () =>{
  cy.visit("/");
  loginPage.doLogin(
   userData.cypressAutomationUserEmail,
   userData.genericPassword); 
  cy.url().should("contain", urlSlugs.employee + urlSlugs.home);
  cy.visit(urlSlugs.admin + urlSlugs.offices);
  officesPage.addNewOffice('2Test', 'Office');
  })

it('Verify the admin can add desks', () =>{
  cy.visit("/");
  loginPage.doLogin(
   userData.cypressAutomationUserEmail,
   userData.genericPassword);
  cy.url().should("contain", urlSlugs.employee + urlSlugs.home);
  cy.visit(urlSlugs.admin + urlSlugs.offices);
  officesPage.searchOffice('1Test');
  officesPage.editOffice();
  addEditDeleteDeskPage.addNewDesks();
  addEditDeleteDeskPage.verifySuccessfullyAddedNewEntitiesMessage();
})

it('Verify the admin can edit desks', () =>{
  cy.visit("/");
  loginPage.doLogin(
    userData.cypressAutomationUserEmail,
    userData.genericPassword);
  cy.url().should("contain", urlSlugs.employee + urlSlugs.home);
  cy.visit(urlSlugs.admin + urlSlugs.offices);
  officesPage.searchOffice('1Test');
  officesPage.editOffice();
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
  officesPage.searchOffice('1Test');
  officesPage.editOffice();
  addEditDeleteDeskPage.deleteDesk();
  addEditDeleteDeskPage.verifySucessfullyDeletedEntityMessage();
 })

 it('Delete Test Office UI', () =>{
  cy.visit("/");
  loginPage.doLogin(
    userData.cypressAutomationUserEmail,
    userData.genericPassword
  );
  cy.url().should("contain", urlSlugs.employee + urlSlugs.home);
  cy.visit(urlSlugs.admin + urlSlugs.offices);
  officesPage.searchOffice('1Test');
  officesPage.deleteOffice();
  officesPage.verifySuccessfullyDeletedOfficeMessage();
  officesPage.searchOffice('2Test');
  officesPage.deleteOffice();
  officesPage.verifySuccessfullyDeletedOfficeMessage();
 }) 