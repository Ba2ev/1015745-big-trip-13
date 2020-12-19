import {render, RenderPosition} from "../utils/render.js";
import TripInfoView from "../view/trip-info.js";
import TripRouteView from "../view/trip-route.js";
import TripCostView from "../view/trip-cost.js";

export default class TripInfo {
  constructor(tripInfoContainer, eventsModel) {
    this._tripInfoContainer = tripInfoContainer;
    this._eventsModel = eventsModel;

    this._tripInfoComponent = new TripInfoView();
    this._tripRouteComponent = null;
    this._tripCostComponent = null;
  }

  init() {
    const events = this._eventsModel.getEvents();

    if (events.length === 0) {
      return;
    }

    this._tripRouteComponent = new TripRouteView(events);
    this._tripCostComponent = new TripCostView(events);

    render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);

    this._renderTripRoute();
    this._renderTripCost();
  }

  _renderTripRoute() {
    render(this._tripInfoComponent, this._tripRouteComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripCost() {
    render(this._tripInfoComponent, this._tripCostComponent);
  }
}
