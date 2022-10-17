import { loginPage } from "../../support/pages/login";
import { homeEmployeePage } from "../../support/pages/home-employee";
import { employeeReservationsPage } from "../../support/pages/employee-reservations";
import * as userData from "../../fixtures/userData.json";
import * as urlSlugs from "../../fixtures/urlSlugs.json";
import * as officesData from "../../fixtures/officesData.json";
import * as apiEndpoints from "../../fixtures/apiEndpoints.json";

describe("Users can select a desk", () => {
  it("Verify that the homepage offices list contains all the offices that are placed in the admin Offices list", () => {
    cy.visit("/");
    loginPage.doLogin(
        userData.cypressAutomationUserEmail,
        userData.genericPassword,
    );
    homeEmployeePage.getOfficesListInHomepage();
    cy.visit(urlSlugs.employee + urlSlugs.reservations);
    employeeReservationsPage.getOfficesListInReservations();
    employeeReservationsPage.assertOfficesAreTheSameAsHomepage();
  });

  it("Verify that the user can select an office from the list", () => {
    cy.visit("/");
    loginPage.doLogin(
        userData.cypressAutomationUserEmail,
        userData.genericPassword,
    );
    cy.url().should("contain", urlSlugs.employee + urlSlugs.home);
    homeEmployeePage.assertUserNameInHeader(
        `${ userData.cypressAutomationFirstName } ${ userData.cypressAutomationLastName }`,
    );
    cy.assertLoadingDotsNotVisible();
    cy.visit(urlSlugs.employee + urlSlugs.reservations);
    cy.assertLoadingDotsNotVisible();
    employeeReservationsPage.assertOfficeIsFiltered(officesData.defaultOffice);
  });

  it.only("Verify that correct data is returned when office is selected on home employee page", () => {
    const SKOPJE_OFFICE_ID = 77;

    cy.visit("/");
    loginPage.doLogin(
        userData.cypressAutomationUserEmail,
        userData.genericPassword,
    );
    cy.url().should("contain", urlSlugs.employee + urlSlugs.home);
    cy.assertLoadingDotsNotVisible();

    cy.intercept(`${ apiEndpoints.employeeOfficeImage }${ SKOPJE_OFFICE_ID }`).as("officeImage");
    cy.intercept(`${ apiEndpoints.employeeOfficeDesks }${ SKOPJE_OFFICE_ID }`).as("officeData");
    homeEmployeePage.selectOffice("IT-Labs Skopje");
    cy.wait("@officeImage").its("response.body").should("contain", "https://i.postimg.cc/90NqbwHd/in-Office-PLAN.jpg");
    cy.wait("@officeData").then((resp) => {
      expect(resp.response.statusCode).to.eq(200);
      expect(resp.response.body).not.to.be.empty;
    });
  });
});