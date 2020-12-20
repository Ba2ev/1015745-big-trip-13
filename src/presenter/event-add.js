import EventAddView from "../view/event-add.js";
import EventAddBtnView from "../view/event-add-btn.js";
import {generateId} from "../mock/event.js";
import {remove, render, RenderPosition} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";

export default class EventNew {
  constructor(eventListContainer, changeData) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeData;

    this._eventNewComponent = null;
    this._destroyCallback = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(callback) {
    this._destroyCallback = callback;
    if (this._eventNewComponent !== null) {
      return;
    }

    this._eventNewComponent = new EventAddView();
    this._eventNewComponent.setSubmitHandler(this._handleFormSubmit);
    this._eventNewComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._eventListContainer, this._eventNewComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._eventNewComponent === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    remove(this._eventNewComponent);
    this._eventNewComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);

    EventAddBtnView.enable();
  }

  _handleFormSubmit(event) {
    this._changeData(
        UserAction.ADD_EVENT,
        UpdateType.MINOR,
        Object.assign({id: generateId()}, event)
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
