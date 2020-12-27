import {UpdateType} from "../const.js";
import {render, RenderPosition} from "../utils/render.js";
import TripInfoView from "../view/trip-info.js";
import TripRouteView from "../view/trip-route.js";
import TripCostView from "../view/trip-cost.js";

export default class TripInfo {
  constructor(tripInfoContainer, eventsModel) {
    this._tripInfoContainer = tripInfoContainer;
    this._eventsModel = eventsModel;

    this._tripInfoComponent = null;
    this._tripRouteComponent = null;
    this._tripCostComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._eventsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderTripInfo();
  }

  _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.INIT:
        this._renderTripInfo();
        break;
    }
  }

  _renderTripRoute() {
    render(this._tripInfoComponent, this._tripRouteComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripCost() {
    render(this._tripInfoComponent, this._tripCostComponent);
  }

  _renderTripInfo() {
    if (this._eventsModel.getEvents().length === 0) {
      return;
    }

    const events = this._eventsModel.getEvents();

    this._tripInfoComponent = new TripInfoView();
    this._tripRouteComponent = new TripRouteView(events);
    this._tripCostComponent = new TripCostView(events);

    render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);

    this._renderTripRoute();
    this._renderTripCost();
  }
}
