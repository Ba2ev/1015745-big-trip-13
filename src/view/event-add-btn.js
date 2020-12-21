import AbstractView from "./abstract.js";

const createEventAddBtnTemplate = () => {
  return `<button class="trip-main__event-add-btn btn btn--big btn--yellow" type="button">
    New event
  </button>`;
};

export default class EventAddBtn extends AbstractView {
  constructor() {
    super();

    this._addBtnClickHandler = this._addBtnClickHandler.bind(this);
  }

  getTemplate() {
    return createEventAddBtnTemplate();
  }

  static enable() {
    document.querySelector(`.trip-main__event-add-btn`).disabled = false;
  }

  static disable() {
    document.querySelector(`.trip-main__event-add-btn`).disabled = true;
  }

  _addBtnClickHandler(evt) {
    evt.preventDefault();
    this._callback.btnClick();
  }

  setAddBtnClickHandler(callback) {
    this._callback.btnClick = callback;
    this.getElement().addEventListener(`click`, this._addBtnClickHandler);
  }
}
