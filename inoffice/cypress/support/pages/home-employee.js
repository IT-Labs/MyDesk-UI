import moment from "moment";

export class HomeEmployeePage {
  /**
   * Locators.
   */
  userHeaderLink() {
    return cy.get("[data-cy=user-header-link]");
  }

  logoutButton() {
    return cy.get("[data-cy=logout-button]");
  }

  displayCalendarIcon() {
    return cy.get(".anticon-calendar");
  }

  startDateNextMonthCalendarButton() {
    return cy.get(".ant-picker-header-next-btn").first();
  }

  startDatePreviousMonthCalendarButton() {
    return cy.get(".ant-picker-header-prev-btn").first();
  }

  startDateMonthLabel() {
    return cy.get(".ant-picker-month-btn").first();
  }

  startDateYearLabel() {
    return cy.get(".ant-picker-year-btn").first();
  }

  todayCell() {
    return cy.get(".ant-picker-cell-today.ant-picker-cell-in-view");
  }

  /**
   * Methods.
   */
  assertUserNameInHeader(userFullName) {
    this.userHeaderLink().should("have.text", userFullName).and("be.visible");
  }

  clickLogoutButton() {
    this.logoutButton().click();
  }

  clickCalendarIcon() {
    this.displayCalendarIcon().click({ force: true });
  }

  clickStartDateNextMonthButton() {
    this.startDateNextMonthCalendarButton().click({ force: true });
  }

  clickStartDatePrevMonthButton() {
    this.startDatePreviousMonthCalendarButton().click({ force: true });
  }

  assertNextMonthIsDisplayed() {
    this.clickCalendarIcon();
    this.clickStartDateNextMonthButton();
    this.startDateMonthLabel().should("have.text", this.getNextMonth());
  }

  assertPreviousMonthIsDisplayed() {
    this.clickCalendarIcon();
    this.clickStartDatePrevMonthButton();
    this.startDateMonthLabel().should("have.text", this.getPreviousMonth());
  }

  getNextMonth() {
    const currentMoment = moment(new Date());
    const nextMonth = currentMoment.add(1, "months").format("MMM");
    return nextMonth;
  }

  getPreviousMonth() {
    const currentMoment = moment(new Date());
    const previousMonth = currentMoment.subtract(1, "months").format("MMM");
    return previousMonth;
  }

  getCurrentMonth() {
    const currentMoment = moment(new Date());
    const currentMonth = currentMoment.format("MMM");
    return currentMonth;
  }

  getCurrentYear() {
    const currentMoment = moment(new Date());
    const currentYear = currentMoment.format("YYYY");
    return currentYear;
  }

  getCurrentDay() {
    const currentMoment = moment(new Date());
    const currentDay = currentMoment.format("DD");
    return currentDay;
  }

  assertCurrentDateIsDefaultDate() {
    this.clickCalendarIcon();
    this.startDateYearLabel().should("have.text", this.getCurrentYear());
    this.startDateMonthLabel().should("have.text", this.getCurrentMonth());
    this.todayCell().should("have.text", this.getCurrentDay());
  }
}

export const homeEmployeePage = new HomeEmployeePage();
