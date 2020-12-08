import {render, replace} from "../utils/render.js";
import EventView from "../view/event.js";
import EventEditView from "../view/event-edit.js";

export default class Event {
  constructor(eventListContainer) {
    this._eventListContainer = eventListContainer;

    this._eventComponent = null;
    this._eventEditComponent = null;

    this._handleRollDownClick = this._handleRollDownClick.bind(this);
    this._handleRollUpClick = this._handleRollUpClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(event) {
    this._event = event;

    this._eventComponent = new EventView(event);
    this._eventEditComponent = new EventEditView(event);

    this._eventComponent.setRollupClickHandler(this._handleRollDownClick);
    this._eventEditComponent.setRollupClickHandler(this._handleRollUpClick);
    this._eventEditComponent.setSubmitHandler(this._handleFormSubmit);

    render(this._eventListContainer, this._eventComponent);
  }

  _replaceEventToForm() {
    replace(this._eventEditComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _replaceFormToEvent() {
    replace(this._eventComponent, this._eventEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleRollDownClick() {
    this._replaceEventToForm();
  }

  _handleRollUpClick() {
    this._replaceFormToEvent();
  }

  _handleFormSubmit() {
    this._replaceFormToEvent();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._replaceFormToEvent();
    }
  }
}
