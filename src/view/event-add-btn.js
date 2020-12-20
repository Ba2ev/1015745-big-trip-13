import AbstractView from "./abstract.js";

const createEventAddBtnTemplate = () => {
  return `<button class="trip-main__event-add-btn btn btn--big btn--yellow" type="button">
    New event
  </button>`;
};

export default class EventAddBtn extends AbstractView {
  constructor() {
    super();

    this._btnClickHandler = this._btnClickHandler.bind(this);
  }
  getTemplate() {
    return createEventAddBtnTemplate();
  }

  enable() {
    this.getElement().disabled = false;
  }

  disable() {
    this.getElement().disabled = true;
  }

  _btnClickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setBtnClickHandler(callback) {
    this._callback.click = callback;
    this.getElement(`.trip-main__event-add-btn`).addEventListener(`click`, this._btnClickHandler);
  }
}
