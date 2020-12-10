import {getRandomInteger} from './utils/common.js';
import {render, RenderPosition} from './utils/render';
import {generateEvent} from './mock/event';
import MenuView from "./view/menu.js";
import EventAddBtn from "./view/event-add-btn.js";
import FilterView from "./view/filter.js";
import TripInfoPresenter from "./presenter/trip-Info.js";
import TripPresenter from "./presenter/trip.js";

const eventCount = getRandomInteger(2, 20);

const events = new Array(eventCount).fill().map(generateEvent).sort((a, b) => a.date.start - b.date.start);

const siteHeaderTripElement = document.querySelector(`.trip-main`);
const siteHeaderControlsElement = document.querySelector(`.trip-controls`);
const siteMainTripElement = document.querySelector(`.trip-events`);

const tripInfoPresenter = new TripInfoPresenter(siteHeaderTripElement);
const tripPresenter = new TripPresenter(siteMainTripElement);

render(siteHeaderControlsElement, new MenuView(), RenderPosition.AFTERBEGIN);
render(siteHeaderControlsElement, new FilterView());
render(siteHeaderTripElement, new EventAddBtn());

tripInfoPresenter.init(events);
tripPresenter.init(events);
