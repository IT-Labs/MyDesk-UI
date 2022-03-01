import React from "react";

export const Form = ({ onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="name">Office name</label>
        <input className="form-control" id="name" placeholder="office name" />
      </div>
      <div className="form-group">
        <label htmlFor="location">Office location</label>
        <input
          type="text"
          className="form-control"
          id="location"
          placeholder="location"
        />
      </div>
      <div className="form-group">
        <button className="formButton" type="submit">
          Save
        </button>
        <button className="formButton" type="submit">
          Cancel
        </button>
      </div>
    </form>
  );
};
export default Form;
