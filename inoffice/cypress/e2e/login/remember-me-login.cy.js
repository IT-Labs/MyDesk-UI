import { loginPage } from "../../support/pages/login";
import * as userData from "../../fixtures/userData.json";

describe("Login failed functionality", () => {
  const INCORRECT_PASSWORD = "incorrect-password";

  it("Remember me checkbox on login page is unselected by default", () => {
    cy.visit("/");
    loginPage.rememberMeCheckBox().should("not.be.checked");
  });
});
