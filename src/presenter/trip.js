import {render, RenderPosition} from "../utils/render.js";
import {updateItem} from "../utils/common.js";
import {SortType} from "../const.js";
import {sortEventTime, sortEventPrice} from "../utils/event.js";
import EventEmptyView from "../view/event-empty.js";
import SortView from "../view/sort.js";
import EventListView from "../view/event-list.js";
import EventPresenter from "../presenter/event.js";

export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;

    this._events = [];
    this._eventPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = new SortView();
    this._eventListComponent = new EventListView();
    this._eventEmptyComponent = new EventEmptyView();

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(events) {
    this._events = events.slice();
    this._sourcedEvents = events.slice();

    render(this._tripContainer, this._eventListComponent);

    this._renderTrip();
  }

  _handleEventChange(updatedEvent) {
    this._events = updateItem(this._events, updatedEvent);
    this._eventPresenter[updatedEvent.id].init(updatedEvent);
  }

  _handleModeChange() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _sortEvents(sortType) {

    switch (sortType) {
      case SortType.TIME:
        this._events.sort(sortEventTime);
        break;
      case SortType.PRICE:
        this._events.sort(sortEventPrice);
        break;
      default:
        this._events = this._sourcedEvents.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortEvents(sortType);
    this._clearEvents();
    this._renderEvents();
  }

  _clearEvents() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};
  }

  _renderSort() {
    render(this._tripContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderEventEmpty() {
    render(this._tripContainer, this._eventEmptyComponent);
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._eventListComponent, this._handleEventChange, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _renderEvents() {
    this._events.forEach((event) => this._renderEvent(event));
  }

  _renderTrip() {

    if (this._events.length === 0) {
      this._renderEventEmpty();
      return;
    }

    this._renderSort();
    this._renderEvents();
  }
}
