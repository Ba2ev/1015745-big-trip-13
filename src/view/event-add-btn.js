import AbstractView from "./abstract.js";

const createEventAddBtnTemplate = () => {
  return `<button class="trip-main__event-add-btn btn btn--big btn--yellow" type="button">
    New event
  </button>`;
};

export default class EventAddBtn extends AbstractView {
  getTemplate() {
    return createEventAddBtnTemplate();
  }
}
