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

  firstAvailableDayOfNextMonthInCalendar() {
    return cy
      .get(".ant-picker-cell.ant-picker-cell-start.ant-picker-cell-in-view")
      .last();
  }

  lastAvailableDayOfNextMonthInCalendar() {
    return cy
      .get(".ant-picker-cell.ant-picker-cell-end.ant-picker-cell-in-view")
      .last();
  }

  lastAvailableDayOfCurrentMonthInCalendar() {
    return cy
      .get(".ant-picker-cell.ant-picker-cell-end.ant-picker-cell-in-view")
      .first();
  }

  startDateInputInCalendar() {
    return cy.get(".ant-picker-input input").first();
  }

  endDateInputInCalendar() {
    return cy.get(".ant-picker-input input").last();
  }

  availabilityFilterDropdown() {
    return cy.get(
      "[data-cy=filter-by-availability] .ant-select-selector span.ant-select-selection-item"
    );
  }

  desksCards() {
    return cy.get(".ant-list-item");
  }

  desksCard() {
    return cy.get(".ant-col");
  }

  reserveButton() {
    return cy.get("[data-cy=reserve-button]");
  }

  showReviewsButton() {
    return cy.get("[data-cy=show-reviews-button]");
  }

  modalMessageLabel() {
    return cy.get(".ant-notification-notice-message");
  }

  modalDescriptionLabel() {
    return cy.get(".ant-notification-notice-description");
  }

  availabilityOptionDropdown() {
    return cy.get(".ant-select-item-option-content");
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
    this.todayCell().should("have.text", this.getCurrentDay("D"));
  }

  selectFirstAvailableDayOfNextMonth() {
    this.firstAvailableDayOfNextMonthInCalendar().click();
  }

  selectLastAvailableDayOfNextMonth() {
    this.lastAvailableDayOfNextMonthInCalendar().click();
  }

  assertSingleDateIsSelected() {
    this.startDateInputInCalendar()
      .invoke("val")
      .then((startDate) => {
        this.endDateInputInCalendar().should("have.value", startDate);
      });
  }

  assertRangeDateIsSelected() {
    this.endDateInputInCalendar()
      .invoke("val")
      .then((endDate) => {
        this.startDateInputInCalendar()
          .invoke("val")
          .then((startDate) => {
            expect(moment(endDate, "DD/MM/YYYY").toDate()).to.be.greaterThan(
              moment(startDate, "DD/MM/YYYY").toDate()
            );
          });
      });
  }

  filterByAvailability(availability) {
    this.availabilityFilterDropdown().click();
    this.availabilityOptionDropdown().contains(availability).click();
  }

  selectDeskN(n) {
    this.desksCards()
      .eq(n - 1)
      .click();
  }

  verifyOnlyOneDeskIsSelected() {
    this.desksCard()
      .find(
        `.ant-list-item[style="border: 2px solid; transition: all 0.3s ease-in-out 0s;"]`
      )
      .should("have.length", 1);
  }

  verifyReservationIsSuccessful() {
    this.modalMessageLabel().should("have.text", "Notification");
    this.modalDescriptionLabel().should(
      "have.text",
      "You have successfully reserved a desk."
    );
  }

  verifyPastDatesAreDisabledInCalendar() {
    // previous days in the same week
    this.todayCell()
      .prevAll()
      .each(($td) => {
        expect($td).to.have.class("ant-picker-cell-disabled");
      });

    // days in the previous weeks
    this.todayCell()
      .parent()
      .prevAll()
      .find("td")
      .each(($td) => {
        expect($td).to.have.class("ant-picker-cell-disabled");
      });
  }

  verifyWeekendsAreDisabledInCalendar() {
    cy.get(".ant-picker-content")
      .first()
      .find("td")
      .each(($td, $index) => {
        const weekendsIndex = new Array(
          0,
          6,
          7,
          13,
          14,
          20,
          21,
          27,
          28,
          34,
          35
        );

        if (weekendsIndex.includes($index)) {
          cy.log($td.text() + " = " + $index);
          expect($td).to.have.class("ant-picker-cell-disabled");
        }
      });
  }
}

export const homeEmployeePage = new HomeEmployeePage();
