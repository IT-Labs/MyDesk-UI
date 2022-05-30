import React, { Component } from "react";
import { Modal } from "./Modal";
import AddOfficeButton from "./AddOfficeButton";
export class AddOfficeContainer extends Component {
  state = { isShown: false };
  showModal = () => {
    this.setState({ isShown: true }, () => {
      this.closeButton.focus();
    });
    this.toggleScrollLock();
  };
  closeModal = () => {
    this.setState({ isShown: false });
    this.AddOfficeButton.focus();
    this.toggleScrollLock();
  };
  onKeyDown = (event) => {
    if (event.keyCode === 27) {
      this.closeModal();
    }
  };

  toggleScrollLock = () => {
    document.querySelector("html").classList.toggle("scroll-lock");
  };
  render() {
    return (
      <React.Fragment>
        <AddOfficeButton
          showModal={this.showModal}
          buttonRef={(n) => (this.AddOfficeButton = n)}
          addOfficeText={this.props.addOfficeText}
        />
        {this.state.isShown ? (
          <Modal
            onSubmit={this.props.onSubmit}
            modalRef={(n) => (this.modal = n)}
            buttonRef={(n) => (this.closeButton = n)}
            closeModal={this.closeModal}
            onKeyDown={this.onKeyDown}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

export default AddOfficeContainer;
