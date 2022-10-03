import { loginPage } from '../../support/pages/login';
import { homeEmployeePage } from '../../support/pages/home-employee';
import * as userData from '../../fixtures/userData.json';
import * as urlSlugs from '../../fixtures/urlSlugs.json';

describe('Login functionality', () => {

  const INCORRECT_PASSWORD = 'incorrect-password';

  it('Verifies user cannot login with invalid credentials', () => {
    cy.visit('/');
    loginPage.doLogin('incorrect-email@test.com', INCORRECT_PASSWORD);
    loginPage.verifyIncorrectCredentialsMessageIsDisplayed();
  });

  it('Verifies user cannot login with valid email and invalid password', () => {
    cy.visit('/');
    loginPage.doLogin(userData.cypressAutomationUserEmail, INCORRECT_PASSWORD);
    loginPage.verifyIncorrectCredentialsMessageIsDisplayed();
  });

  it('Verifies user cannot login empty credentials', () => {
    cy.visit('/');
    loginPage.clickSubmitButton();
    cy.url().should('eq', Cypress.config('baseUrl'));
  });

  it('Verifies user can login valid credentials', () => {
    cy.visit('/');
    loginPage.doLogin(userData.cypressAutomationUserEmail, userData.genericPassword);
    loginPage.clickSubmitButton();
    cy.url().should('contain', urlSlugs.employee + urlSlugs.home);
    homeEmployeePage.assertUserNameInHeader(`${ userData.cypressAutomationFirstName } ${ userData.cypressAutomationLastName }`);
  });

  it('Verifies user can logout', () => {
    cy.visit('/');
    loginPage.doLogin(userData.cypressAutomationUserEmail, userData.genericPassword);
    loginPage.clickSubmitButton();
    cy.url().should('contain', urlSlugs.employee + urlSlugs.home);
    homeEmployeePage.assertUserNameInHeader(`${ userData.cypressAutomationFirstName } ${ userData.cypressAutomationLastName }`);
    homeEmployeePage.clickLogoutButton();
    cy.url().should('eq', Cypress.config('baseUrl'));
  });
});
