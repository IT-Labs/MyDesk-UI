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
