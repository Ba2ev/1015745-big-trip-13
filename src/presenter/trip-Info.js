import {render, RenderPosition} from "../utils/render.js";
import TripInfoView from "../view/trip-info.js";
import TripRouteView from "../view/trip-route.js";
import TripCostView from "../view/trip-cost.js";

export default class TripInfo {
  constructor(tripInfoContainer) {
    this._tripInfoContainer = tripInfoContainer;

    this._tripRouteComponent = null;
    this._tripCostComponent = null;
  }

  init(events) {
    this._events = events;

    this._tripInfoComponent = new TripInfoView();
    this._tripRouteComponent = new TripRouteView(events);
    this._tripCostComponent = new TripCostView(events);

    render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
    render(this._tripInfoComponent, this._tripRouteComponent, RenderPosition.AFTERBEGIN);
    render(this._tripInfoComponent, this._tripCostComponent);
  }
}
