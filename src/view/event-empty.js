import AbstractView from "./abstract.js";

const createEventEmptyTemplate = () => {
  return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
};
export default class EventEmpty extends AbstractView {
  getTemplate() {
    return createEventEmptyTemplate();
  }
}
