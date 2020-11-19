import {createTripInfoTemplate} from "./view/trip-info.js";
import {createTripCostTemplate} from "./view/trip-cost.js";
import {createMenuTemplate} from "./view/menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createSortTemplate} from "./view/sort.js";
import {createEventListTemplate} from "./view/event-list.js";
import {createEventTemplate} from "./view/event.js";
import {createEventAddTemplate} from "./view/event-add.js";
import {createEventEditTemplate} from "./view/event-edit.js";

const EVENT_COUNT = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderTripElement = document.querySelector(`.trip-main`);
const siteHeaderControlsElement = document.querySelector(`.trip-controls`);
const siteMainEventsElement = document.querySelector(`.trip-events`);

render(siteHeaderTripElement, createTripInfoTemplate(), `afterbegin`);
render(siteHeaderControlsElement, createMenuTemplate(), `afterbegin`);
render(siteHeaderControlsElement, createFilterTemplate(), `beforeend`);
render(siteMainEventsElement, createSortTemplate(), `afterbegin`);
render(siteMainEventsElement, createEventListTemplate(), `beforeend`);

const siteHeaderTripInfoElement = siteHeaderTripElement.querySelector(`.trip-info`);
render(siteHeaderTripInfoElement, createTripCostTemplate(), `beforeend`);

const siteMainEventsListElement = siteMainEventsElement.querySelector(`.trip-events__list`);
for (let i = 0; i < EVENT_COUNT; i++) {
  render(siteMainEventsListElement, createEventTemplate(), `beforeend`);
}

render(siteMainEventsListElement, createEventAddTemplate(), `afterbegin`);
render(siteMainEventsListElement, createEventEditTemplate(), `afterbegin`);


