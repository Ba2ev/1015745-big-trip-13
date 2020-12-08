import {render, RenderPosition} from "../utils/render.js";
import {updateItem} from "../utils/common.js";
import EventEmptyView from "../view/event-empty.js";
import SortView from "../view/sort.js";
import EventListView from "../view/event-list.js";
import TripInfoPresenter from "../presenter/trip-Info.js";
import EventPresenter from "../presenter/event.js";

export default class Trip {
  constructor(tripHeaderContainer, tripMainContainer) {
    this._tripInfoContainer = tripHeaderContainer;
    this._tripContainer = tripMainContainer;
    this._eventPresenter = {};

    this._sortComponent = new SortView();
    this._eventListComponent = new EventListView();
    this._eventEmptyComponent = new EventEmptyView();

    this._handleEventChange = this._handleEventChange.bind(this);
  }

  init(events) {
    this._events = events.slice();

    render(this._tripContainer, this._eventListComponent);

    this._renderTrip();
  }

  _handleEventChange(updatedEvent) {
    this._events = updateItem(this._events, updatedEvent);
    this._eventPresenter[updatedEvent.id].init(updatedEvent);
  }

  _renderTripInfo() {
    const tripInfoPresenter = new TripInfoPresenter(this._tripInfoContainer);
    tripInfoPresenter.init(this._events);
  }

  _renderSort() {
    render(this._tripContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._eventListComponent, this._handleEventChange);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _renderEvents() {
    this._events.forEach((event) => this._renderEvent(event));
  }

  _renderEventEmpty() {
    render(this._tripContainer, this._eventEmptyComponent);
  }

  _clearEventList() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};
  }

  _renderTrip() {

    if (this._events.length === 0) {
      this._renderEventEmpty();
      return;
    }

    this._renderTripInfo();
    this._renderSort();
    this._renderEvents();
  }
}
