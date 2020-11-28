import {getRandomInteger, render, RenderPosition} from './util';
import {generateEvent} from './mock/event';
import TripInfoView from "./view/trip-info.js";
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

  eventEditComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceFormToEvent();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(eventListElement, eventComponent.getElement(event));
};

render(siteHeaderControlsElement, new MenuView().getElement(), RenderPosition.AFTERBEGIN);
render(siteHeaderControlsElement, new FilterView().getElement());
render(siteHeaderTripElement, new EventAddBtn().getElement());

if (events.length === 0) {
  render(siteMainEventsElement, new EventEmpty().getElement());
} else {
  const tripInfoElement = new TripInfoView();
  render(siteHeaderTripElement, tripInfoElement.getElement(), RenderPosition.AFTERBEGIN);
  render(tripInfoElement.getElement(), new TripRouteView(events).getElement(), RenderPosition.AFTERBEGIN);
  render(tripInfoElement.getElement(), new TripCostView(events).getElement());

  render(siteMainEventsElement, new SortView().getElement(), RenderPosition.AFTERBEGIN);

  const eventListComponent = new EventListView();
  render(siteMainEventsElement, eventListComponent.getElement());
  for (let i = 0; i < eventCount; i++) {
    renderEvent(eventListComponent.getElement(), events[i]);
  }
}
