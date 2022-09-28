import { loginPage } from "../../support/pages/login";

describe("Login failed functionality", () => {
  it("Remember me checkbox on login page is unselected by default", () => {
    cy.visit("/");
    loginPage.assertRememberMeIsUnchecked();
  });
});
