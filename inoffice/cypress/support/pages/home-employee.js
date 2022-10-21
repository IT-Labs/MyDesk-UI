import { commonsPage } from "../pages/commons";
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

  officeBranchFilterDropdown() {
    return cy.get("[data-cy=office-branch-select] .ant-select-selector");
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

  officeDropdown() {
    return cy.get(
      "[data-cy=filter-by-availability] .ant-select-selector span.ant-select-selection-item"
    );
  }

  setForCoworkerCheckbox() {
    return cy.get("[data-cy=set-for-coworker-check]");
  }

  coworkerSelect() {
    return cy.get("[data-cy=coworker-select]");
  }

  coworkerSearchInput() {
    return cy.get(
      "[data-cy=coworker-select] .ant-select-selector .ant-select-selection-search input[type=search]"
    );
  }

  availabilityOptionDropdown() {
    return cy.get(".ant-select-item-option-content");
  }

  modalContainer() {
    return cy.get('[data-cy="modal-container"]');
  }

  officeDropdownAllOptions() {
    return cy.get(
      ".rc-virtual-list-holder-inner .ant-select-item.ant-select-item-option"
    );
  }

  modalContainer() {
    return cy.get('[data-cy="modal-container"]');
  }

  availableDesks() {
    return cy.get(
      `.ant-list-item[style="border: none; transition: all 0.3s ease-in-out 0s;"] .ant-card .ant-card-body[style="background: rgb(105, 226, 141); height: 10rem;"]`
    );
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

  selectFirstAvailableDesk() {
    this.availableDesks().first().click();
  }

  verifyOnlyOneDeskIsSelected() {
    this.desksCard()
      .find(
        `.ant-list-item[style="border: 2px solid; transition: all 0.3s ease-in-out 0s;"]`
      )
      .should("have.length", 1);
  }

  getDeskNumberInSelectedDesk() {
    this.desksCard()
      .find(
        `.ant-list-item[style="border: 2px solid; transition: all 0.3s ease-in-out 0s;"] div div div div div div p`
      )
      .first()
      .as("selectedDeskNumber");
  }

  verifyReservationIsSuccessful() {
    commonsPage
      .notificationModalMessageLabel()
      .should("have.text", "Notification");
    commonsPage
      .notificationModalDescriptionLabel()
      .should("have.text", "You have successfully reserved a desk.");
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

  selectOffice(officeName) {
    this.officeBranchFilterDropdown().click({ force: true });
    cy.get(".ant-select-item.ant-select-item-option")
      .contains(officeName)
      .click({ force: true });
  }

  assertShowReviewsButtonIsDisabled() {
    this.showReviewsButton().should("be.disabled");
  }

  clickShowReviewsButton() {
    this.showReviewsButton().click();
  }

  assertModalIsDisplayed() {
    this.modalContainer()
      .contains("Reviews for selected entity")
      .should("be.visible");
  }

  clickModalOkButton() {
    this.modalContainer().contains("OK").click();
  }

  assertModalIsNotDisplayed() {
    this.modalContainer()
      .contains("Reviews for selected entity")
      .should("not.be.visible");
  }

  assertButtonReserveIsDisabled() {
    this.reserveButton().should("be.disabled");
  }

  selectSetForCoworker() {
    this.setForCoworkerCheckbox().click();
  }

  selectACoworker(coworkerName) {
    this.coworkerSelect().click();
    this.coworkerSearchInput().type(`${coworkerName}{enter}`);
  }

  clickReserveButton() {
    this.reserveButton().click();
  }

  verifyCoworkerIsRequiredWhenSetForCoworker() {
    this.confirmReservationForCoworker("");
    this.assertErrorInNotificationMessage("Co-worker must be selected");
  }

  assertErrorInNotificationMessage(errorMessage) {
    commonsPage.notificationModalMessageLabel().should("have.text", "Error");
    commonsPage
      .notificationModalDescriptionLabel()
      .should("have.text", errorMessage);
  }

  confirmReservationForCoworker(coworkerName) {
    commonsPage
      .confirmationModalTitle()
      .should("have.text", "Reserve desk for co-worker");
    commonsPage
      .confirmationModalMessage()
      .should(
        "contain",
        `Are you sure you want to reserve this desk for ${coworkerName}`
      );
    commonsPage.confirmationModalOkButton().click();
  }

  assertReservationForCoworkerIsSuccessful() {
    commonsPage
      .notificationModalMessageLabel()
      .should("have.text", "Notification");
    commonsPage
      .notificationModalDescriptionLabel()
      .should("have.text", "You have successfully reserved for your co-worker");
  }

  reserveForACoworker(coworkerName) {
    this.selectSetForCoworker();
    this.selectACoworker(coworkerName);
    this.clickReserveButton();
    this.confirmReservationForCoworker(coworkerName);
  }

  verifyReservedDeskHasCoworkerName(coworkerName) {
    cy.get("@selectedDeskNumber")
      .invoke("text")
      .then((deskNumber) => {
        this.desksCard()
          .find(
            `.ant-list-item[style="border: none; transition: all 0.3s ease-in-out 0s;"]  div div div div div.ant-card-meta-title`
          )
          .contains(new RegExp("^" + deskNumber + "$", "g"))
          .parents(".ant-card-body")
          .find(".ant-card-meta-description")
          .should("contain", coworkerName);
      });
  }

  getOfficesListInHomepage() {
    this.officeBranchFilterDropdown().click({ force: true });
    this.officeDropdownAllOptions().then(($officesInHomepage) => {
      Cypress.env("officesInHomepage", $officesInHomepage);
    });
  }
}

export const homeEmployeePage = new HomeEmployeePage();
