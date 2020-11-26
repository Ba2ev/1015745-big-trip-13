import {createTripInfoTemplate} from "./view/trip-info.js";
import {createTripCostTemplate} from "./view/trip-cost.js";
import {createMenuTemplate} from "./view/menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createSortTemplate} from "./view/sort.js";
import {createEventListTemplate} from "./view/event-list.js";
import {createEventTemplate} from "./view/event.js";
import {createEventEditTemplate} from "./view/event-edit.js";
import {generateEvent} from './mock/event';
import {getRandomInteger} from './util';

const eventCount = getRandomInteger(2, 20);

const events = new Array(eventCount).fill().map(generateEvent).sort((a, b) => a.date.start - b.date.start);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderTripElement = document.querySelector(`.trip-main`);
const siteHeaderControlsElement = document.querySelector(`.trip-controls`);
const siteMainEventsElement = document.querySelector(`.trip-events`);

render(siteHeaderTripElement, createTripInfoTemplate(events), `afterbegin`);
render(siteHeaderControlsElement, createMenuTemplate(), `afterbegin`);
render(siteHeaderControlsElement, createFilterTemplate(), `beforeend`);
render(siteMainEventsElement, createSortTemplate(), `afterbegin`);
render(siteMainEventsElement, createEventListTemplate(), `beforeend`);

const siteMainEventsListElement = siteMainEventsElement.querySelector(`.trip-events__list`);
for (let i = 1; i < eventCount; i++) {
  render(siteMainEventsListElement, createEventTemplate(events[i]), `beforeend`);
}

render(siteMainEventsListElement, createEventEditTemplate(events[0]), `afterbegin`);

const siteHeaderTripInfoElement = siteHeaderTripElement.querySelector(`.trip-info`);
render(siteHeaderTripInfoElement, createTripCostTemplate(events), `beforeend`);
