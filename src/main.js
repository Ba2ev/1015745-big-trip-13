import {getRandomInteger} from './utils/common.js';
import {render, RenderPosition, replace} from './utils/render';
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
    replace(eventEditComponent, eventComponent);
  };

  const replaceFormToEvent = () => {
    replace(eventComponent, eventEditComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  eventComponent.setRollupClickHandler(() => {
    replaceEventToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  eventEditComponent.setSubmitHandler(() => {
    replaceFormToEvent();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  eventEditComponent.setRollupClickHandler(() => {
    replaceFormToEvent();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(eventListElement, eventComponent.getElement(event));
};

render(siteHeaderControlsElement, new MenuView(), RenderPosition.AFTERBEGIN);
render(siteHeaderControlsElement, new FilterView());
render(siteHeaderTripElement, new EventAddBtn());

if (events.length === 0) {
  render(siteMainEventsElement, new EventEmpty());
} else {
  const tripInfoElement = new TripInfoView();
  render(siteHeaderTripElement, tripInfoElement, RenderPosition.AFTERBEGIN);
  render(tripInfoElement, new TripRouteView(events), RenderPosition.AFTERBEGIN);
  render(tripInfoElement, new TripCostView(events));

  render(siteMainEventsElement, new SortView(), RenderPosition.AFTERBEGIN);

  const eventListComponent = new EventListView();
  render(siteMainEventsElement, eventListComponent);
  for (let i = 0; i < eventCount; i++) {
    renderEvent(eventListComponent, events[i]);
  }
}
