import {createElement} from "../util";

const createEventAddBtnTemplate = () => {
  return `<button class="trip-main__event-add-btn btn btn--big btn--yellow" type="button">
    New event
  </button>`;
};

export default class EventAddBtn {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createEventAddBtnTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
