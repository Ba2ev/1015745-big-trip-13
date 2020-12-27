import {SortType, UpdateType, UserAction} from "../const.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {sortEventDate, sortEventTime, sortEventPrice} from "../utils/event.js";
import {filter} from "../utils/filter.js";
import LoadingView from "../view/loading.js";
import EventEmptyView from "../view/event-empty.js";
import SortView from "../view/sort.js";
import EventListView from "../view/event-list.js";
import EventPresenter, {State as EventPresenterViewState} from "./event.js";
import EventNewPresenter from "./event-add.js";

export default class Trip {
  constructor(tripContainer, eventsModel, filterModel, api) {
    this._tripContainer = tripContainer;
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;
    this._api = api;

    this._eventPresenter = {};
    this._currentSortType = SortType.DATE;
    this._isLoading = true;

    this._sortComponent = null;
    this._eventEmptyComponent = null;
    this._eventListComponent = new EventListView();
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._eventNewPresenter = new EventNewPresenter(this._eventListComponent, this._handleViewAction);
  }

  init() {
    render(this._tripContainer, this._eventListComponent);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderTrip();
  }

  destroy() {
    this._clearTrip({resetSortType: true});

    remove(this._eventListComponent);

    this._eventsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createEvent(callback) {
    this._eventNewPresenter.init(callback);
  }

  _getEvents() {
    const filterType = this._filterModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filtredEvents = filter[filterType](events);

    switch (this._currentSortType) {
      case SortType.TIME:
        return filtredEvents.sort(sortEventTime);
      case SortType.PRICE:
        return filtredEvents.sort(sortEventPrice);
    }

    return filtredEvents.sort(sortEventDate);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._eventPresenter[update.id].setViewState(EventPresenterViewState.SAVING);
        this._api.updateEvents(update).then((response) => {
          this._eventsModel.updateEvent(updateType, response);
        })
        .catch(() => {
          this._eventPresenter[update.id].setViewState(EventPresenterViewState.ABORTING);
        });
        break;
      case UserAction.ADD_EVENT:
        this._eventNewPresenter.setSaving();
        this._api.addEvent(update).then((response) => {
          this._eventsModel.addEvent(updateType, response);
        })
        .catch(() => {
          this._eventNewPresenter.setAborting();
        });
        break;
      case UserAction.DELETE_EVENT:
        this._eventPresenter[update.id].setViewState(EventPresenterViewState.DELETING);
        this._api.deleteEvent(update).then(() => {
          this._eventsModel.deleteEvent(updateType, update);
        })
        .catch(() => {
          this._eventPresenter[update.id].setViewState(EventPresenterViewState.ABORTING);
        });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true});
        this._renderTrip();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderTrip();
        break;
    }
  }

  _handleModeChange() {
    this._eventNewPresenter.destroy();
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTrip();
    this._renderTrip();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    render(this._tripContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderEventEmpty() {
    if (this._eventEmptyComponent !== null) {
      this._eventEmptyComponent = null;
    }

    this._eventEmptyComponent = new EventEmptyView();
    render(this._tripContainer, this._eventEmptyComponent);
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._eventListComponent, this._handleViewAction, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _renderLoading() {
    render(this._tripContainer, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEvents() {
    this._getEvents().forEach((event) => this._renderEvent(event));
  }

  _clearTrip({resetSortType = false} = {}) {
    this._eventNewPresenter.destroy();

    Object
    .values(this._eventPresenter)
    .forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};

    remove(this._sortComponent);
    remove(this._eventEmptyComponent);
    remove(this._loadingComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DATE;
    }
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (this._getEvents().length === 0) {
      this._renderEventEmpty();
      return;
    }

    this._renderSort();
    this._renderEvents();
  }
}
