import {getRandomInteger, render, RenderPosition} from './util';
import {generateEvent} from './mock/event';
import TripRouteView from "./view/trip-route.js";
import TripCostView from "./view/trip-cost.js";
import MenuView from "./view/menu.js";
import EventAddBtn from "./view/event-add-btn.js";
import EventEmpty from "./view/event-empty.js";
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

const renderEvent = (eventListElement, event) => {
  const eventComponent = new EventView(event);
  const eventEditComponent = new EventEditView(event);

  const replaceEventToForm = () => {
    eventListElement.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
  };

  const replaceFormToEvent = () => {
    eventListElement.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  eventComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceEventToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  eventEditComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToEvent();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(eventListElement, eventComponent.getElement(event), RenderPosition.BEFOREEND);
};

render(siteHeaderControlsElement, new MenuView().getElement(), RenderPosition.AFTERBEGIN);
render(siteHeaderControlsElement, new FilterView().getElement(), RenderPosition.BEFOREEND);
render(siteHeaderTripElement, new EventAddBtn().getElement(), RenderPosition.BEFOREEND);

if (events.length === 0) {
  render(siteMainEventsElement, new EventEmpty().getElement(), RenderPosition.BEFOREEND);
} else {
  render(siteHeaderTripElement, new TripRouteView(events).getElement(), RenderPosition.AFTERBEGIN);

  const siteHeaderTripInfoElement = siteHeaderTripElement.querySelector(`.trip-info`);
  render(siteHeaderTripInfoElement, new TripCostView(events).getElement(), RenderPosition.
  BEFOREEND);

  render(siteMainEventsElement, new SortView().getElement(), RenderPosition.AFTERBEGIN);

  const eventListComponent = new EventListView();
  render(siteMainEventsElement, eventListComponent.getElement(), RenderPosition.BEFOREEND);

  for (let i = 0; i < eventCount; i++) {
    renderEvent(eventListComponent.getElement(), events[i]);
  }
}
