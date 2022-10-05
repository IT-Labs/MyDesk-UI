import { loginPage } from '../../support/pages/login';
import { registerPage } from '../../support/pages/register';


it('Verify the presence of Microsoft SSO button on Login Page', () =>{
    cy.visit('/');
    loginPage.verifyPresenceOfMicrosoftSSOButton();
})

it('Verify login page title', () =>{
    cy.visit('/');
    loginPage.verifyLoginPageTitle();

})

it('Verify that login page contains welcome text', () =>{
    cy.visit('/');
    loginPage.verifyWelcomeBackText();
})

it('Verify that the Register link redirects to the Register Page', () =>{
    cy.visit('/');
    loginPage.clickRegisterButton();
    registerPage.verifyCreateYourAccountLable();
    registerPage.verifyRegisterFormIsVisible();
    registerPage.verifyRegisterButton();
})