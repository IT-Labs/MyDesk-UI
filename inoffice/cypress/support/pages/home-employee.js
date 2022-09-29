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

  firstDayOfNextMonthInCalendar() {
    return cy
      .get(".ant-picker-cell.ant-picker-cell-start.ant-picker-cell-in-view")
      .last();
  }

  startDateInputInCalendar() {
    return cy.get(".ant-picker-input input").first();
  }

  endDateInputInCalendar() {
    return cy.get(".ant-picker-input input").last();
  }

  //.ant-picker-input.ant-picker-input-active
  //.ant-picker-input.ant-picker-input-active

  /**
   * Methods.
   */
  assertUserNameInHeader(userFullName) {
    this.userHeaderLink().should("have.text", userFullName).and("be.visible");
  }

  clickLogoutButton() {
    this.logoutButton().click();
  }

  openCalendar() {
    this.displayCalendarIcon().click({ force: true });
  }

  clickStartDateNextMonthButton() {
    this.startDateNextMonthCalendarButton().click({ force: true });
  }

  clickStartDatePrevMonthButton() {
    this.startDatePreviousMonthCalendarButton().click({ force: true });
  }

  assertNextMonthIsDisplayed() {
    this.openCalendar();
    this.clickStartDateNextMonthButton();
    this.startDateMonthLabel().should("have.text", this.getNextMonth("MMM"));
  }

  assertPreviousMonthIsDisplayed() {
    this.openCalendar();
    this.clickStartDatePrevMonthButton();
    this.startDateMonthLabel().should(
      "have.text",
      this.getPreviousMonth("MMM")
    );
  }

  getNextMonth(monthFormat) {
    const currentMoment = moment(new Date());
    const nextMonth = currentMoment.add(1, "months").format(monthFormat);
    return nextMonth;
  }

  getYearOfNextMonth() {
    const currentMoment = moment(new Date());
    const yearOfNextMonth = currentMoment.add(1, "months").format("YYYY");
    return yearOfNextMonth;
  }

  getPreviousMonth(monthFormat) {
    const currentMoment = moment(new Date());
    const previousMonth = currentMoment
      .subtract(1, "months")
      .format(monthFormat);
    return previousMonth;
  }

  getCurrentMonth(monthFormat) {
    const currentMoment = moment(new Date());
    const currentMonth = currentMoment.format(monthFormat);
    return currentMonth;
  }

  getCurrentYear() {
    const currentMoment = moment(new Date());
    const currentYear = currentMoment.format("YYYY");
    return currentYear;
  }

  getCurrentDay(dayFormat) {
    const currentMoment = moment(new Date());
    const currentDay = currentMoment.format(dayFormat);
    return currentDay;
  }

  assertCurrentDateIsDefaultDate() {
    this.openCalendar();
    this.startDateYearLabel().should("have.text", this.getCurrentYear());
    this.startDateMonthLabel().should("have.text", this.getCurrentMonth("MMM"));
    this.todayCell().should("have.text", this.getCurrentDay("DD"));
  }

  selectFirstDayOfNextMonth() {
    this.firstDayOfNextMonthInCalendar().click();
  }

  assertSingleDateIsSelected() {
    this.startDateInputInCalendar()
      .invoke("val")
      .then((startDate) => {
        this.endDateInputInCalendar().should("have.value", startDate);
      });
  }
}

export const homeEmployeePage = new HomeEmployeePage();
