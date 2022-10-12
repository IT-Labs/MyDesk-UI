import { loginPage } from "../../support/pages/login";
import { homeEmployeePage } from "../../support/pages/home-employee";
import { adminReservationsPage } from "../../support/pages/admin-reservations";

import * as userData from "../../fixtures/userData.json";
import * as urlSlugs from "../../fixtures/urlSlugs.json";
import * as officesData from "../../fixtures/officesData.json";

describe("Users can select a desk", () => {
  // Failing due to bug https://dev.azure.com/ITLabs-LLC/Internship%202022/_workitems/edit/53491/
  // @TODO complete once bug is fixed
  it.skip("Verify that when the user selects the office, only the reservations made in the selected office are being shown", () => {
    cy.visit("/");
    loginPage.doLogin(
      userData.cypressAutomationUserEmail,
      userData.genericPassword
    );
    cy.url().should("contain", urlSlugs.employee + urlSlugs.home);
    homeEmployeePage.assertUserNameInHeader(
      `${userData.cypressAutomationFirstName} ${userData.cypressAutomationLastName}`
    );
    cy.assertLoadingDotsNotVisible();
    cy.visit(urlSlugs.admin + urlSlugs.reservations);
    cy.assertLoadingDotsNotVisible();
    adminReservationsPage.assertOfficeIsFiltered(officesData.defaultOffice);
  });
});
