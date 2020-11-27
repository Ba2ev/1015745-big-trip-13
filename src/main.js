import {getRandomInteger, render, RenderPosition} from './util';
import {generateEvent} from './mock/event';
import TripRouteView from "./view/trip-route.js";
import TripCostView from "./view/trip-cost.js";
import MenuView from "./view/menu.js";
import EventAddBtn from "./view/event-add-btn.js";
import FilterView from "./view/filter.js";
import SortView from "./view/sort.js";
import EventListView from "./view/event-list.js";
import EventView from "./view/event.js";
import EventEditView from "./view/event-edit.js";

const eventCount = getRandomInteger(2, 20);

const events = new Array(eventCount).fill().map(generateEvent).sort((a, b) => a.date.start - b.date.start);

const siteHeaderTripElement = document.querySelector(`.trip-main`);
const siteHeaderControlsElement = document.querySelector(`.trip-controls`);
const siteMainEventsElement = document.querySelector(`.trip-events`);

render(siteHeaderTripElement, new TripRouteView(events).getElement(), RenderPosition.AFTERBEGIN);

const siteHeaderTripInfoElement = siteHeaderTripElement.querySelector(`.trip-info`);
render(siteHeaderTripInfoElement, new TripCostView(events).getElement(), RenderPosition.
BEFOREEND);

render(siteHeaderTripElement, new EventAddBtn().getElement(), RenderPosition.BEFOREEND);

render(siteHeaderControlsElement, new MenuView().getElement(), RenderPosition.AFTERBEGIN);
render(siteHeaderControlsElement, new FilterView().getElement(), RenderPosition.BEFOREEND);

render(siteMainEventsElement, new SortView().getElement(), RenderPosition.AFTERBEGIN);
render(siteMainEventsElement, new EventListView().getElement(), RenderPosition.BEFOREEND);

const siteMainEventsListElement = siteMainEventsElement.querySelector(`.trip-events__list`);
for (let i = 1; i < eventCount; i++) {
  render(siteMainEventsListElement, new EventView(events[i]).getElement(), RenderPosition.BEFOREEND);
}

render(siteMainEventsListElement, new EventEditView(events[0]).getElement(), RenderPosition.AFTERBEGIN);
