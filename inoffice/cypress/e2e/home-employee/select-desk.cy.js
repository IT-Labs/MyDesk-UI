import { loginPage } from '../../support/pages/login';
import { homeEmployeePage } from '../../support/pages/home-employee';
import * as userData from '../../fixtures/userData.json';

describe('Users can select a desk', () => {
  it('Verify that the user can select only one desk in a reservation', () => {
    cy.visit('/');
    loginPage.doLogin(
        userData.cypressAutomationUserEmail,
        userData.genericPassword,
    );
    homeEmployeePage.selectOffice('IT-Labs Skopje');
    homeEmployeePage.openCalendar();
    homeEmployeePage.selectFirstAvailableDayOfNextMonth();
    homeEmployeePage.selectFirstAvailableDayOfNextMonth();
    homeEmployeePage.assertLoadingDotsNotVisible();
    homeEmployeePage.filterByAvailability('Available');
    homeEmployeePage.selectDeskN(1);
    homeEmployeePage.selectDeskN(2);
    homeEmployeePage.verifyOnlyOneDeskIsSelected();
  });

  it("Complete a reservation successfully", () => {
    cy.visit('/');
    loginPage.doLogin(
        userData.cypressAutomationUserEmail,
        userData.genericPassword,
    );
    homeEmployeePage.selectOffice('IT-Labs Skopje');
    homeEmployeePage.openCalendar();
    homeEmployeePage.selectFirstAvailableDayOfNextMonth();
    homeEmployeePage.selectFirstAvailableDayOfNextMonth();
    homeEmployeePage.assertLoadingDotsNotVisible();
    homeEmployeePage.filterByAvailability('Available');
    homeEmployeePage.selectDeskN(1);
    homeEmployeePage.reserveButton().click();
    homeEmployeePage.verifyReservationIsSuccessful();
  });

  it("Verify that Reserve button is disabled when a reserved desk is selected", () => {
    cy.visit('/');
    loginPage.doLogin(
        userData.cypressAutomationUserEmail,
        userData.genericPassword,
    );
    homeEmployeePage.selectOffice('IT-Labs Skopje');
    homeEmployeePage.openCalendar();
    homeEmployeePage.selectFirstAvailableDayOfNextMonth();
    homeEmployeePage.selectFirstAvailableDayOfNextMonth();
    homeEmployeePage.assertLoadingDotsNotVisible();
    homeEmployeePage.filterByAvailability('Reserved');
    homeEmployeePage.selectDeskN(1);
    homeEmployeePage.assertButtonReserveIsDisabled();
  });

  // Failing due to bug https://dev.azure.com/ITLabs-LLC/Internship%202022/_workitems/edit/53204/
  // @TODO remove skip once bug is fixed
  it.skip("Verify that when the user forgot to choose a co-worker from the search bar and clicks the Reserve button, the error notification message appears", () => {
    cy.visit('/');
    loginPage.doLogin(
        userData.cypressAutomationUserEmail,
        userData.genericPassword,
    );
    homeEmployeePage.selectOffice('IT-Labs Skopje');
    homeEmployeePage.openCalendar();
    homeEmployeePage.selectFirstAvailableDayOfNextMonth();
    homeEmployeePage.selectFirstAvailableDayOfNextMonth();
    homeEmployeePage.assertLoadingDotsNotVisible();
    homeEmployeePage.filterByAvailability('Available');
    homeEmployeePage.selectDeskN(1);
    homeEmployeePage.selectSetForCoworker();
    homeEmployeePage.clickReserveButton();
    this.modalMessageLabel().should('have.text', 'Error');
    this.modalDescriptionLabel().should('have.text', '');
  });
});
