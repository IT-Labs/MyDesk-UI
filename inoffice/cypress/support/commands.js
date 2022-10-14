import * as apiEndpoints from "../fixtures/apiEndpoints.json";
// found here https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
Cypress.on("uncaught:exception", (err) => {
  /* returning false here prevents Cypress from failing the test */
  if (resizeObserverLoopErrRe.test(err.message)) {
    return false;
  }
});

Cypress.Commands.add("clickOnScreenPosition", (position) => {
  cy.get("body").click(position);
});

Cypress.Commands.add("assertLoadingDotsNotVisible", (position) => {
  cy.get("[data-cy=loading-dots]", { timeout: 20000 }).should("not.exist");
});

Cypress.Commands.add("getToken", (email, password) => {
  cy.request({
    method: "POST",
    url: `${apiEndpoints.baseApiUrl}${apiEndpoints.token}`,
    body: {
      email: email,
      password: btoa(password),
    },
  }).then((response) => {
    expect(response.status).to.eq(200);
  });
});

Cypress.Commands.add(
  "createOfficeApi",
  (userEmailToAuthenticate, userPassword, officeName, locationName) => {
    cy.getToken(userEmailToAuthenticate, userPassword).as("authToken");

    cy.get("@authToken").then((authToken) => {
      cy.request({
        method: "POST",
        url: `${apiEndpoints.baseApiUrl}${apiEndpoints.createOffice}`,
        body: {
          name: `${officeName} ${locationName}`,
        },
        headers: {
          Authorization: authToken.body,
        },
      }).then((response) => {
        expect(response.status).to.eq(201);
      });
    });
  }
);

Cypress.Commands.add(
  "getOfficesApi",
  (userEmailToAuthenticate, userPassword) => {
    cy.getToken(userEmailToAuthenticate, userPassword).as("authToken");

    cy.get("@authToken").then((authToken) => {
      cy.request({
        method: "GET",
        url: `${apiEndpoints.baseApiUrl}${apiEndpoints.getOffices}`,
        headers: {
          Authorization: authToken.body,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  }
);

Cypress.Commands.add(
  "deleteOfficeApi",
  (userEmailToAuthenticate, userPassword, officeId) => {
    cy.getToken(userEmailToAuthenticate, userPassword).as("authToken");

    cy.get("@authToken").then((authToken) => {
      cy.request({
        method: "DELETE",
        url: `${apiEndpoints.baseApiUrl}${apiEndpoints.createOffice}`,
        headers: {
          Authorization: authToken.body,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  }
);

Cypress.Commands.add("getTokenFromLocalStorage", (position) => {
  return cy.wrap(localStorage.getItem("accessToken"));
});
