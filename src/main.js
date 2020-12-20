import {getRandomInteger} from './utils/common.js';
import {render, RenderPosition} from './utils/render';
import {generateEvent} from './mock/event';
import EventsModel from "./model/events.js";
import FilterModel from "./model/filter.js";
import MenuView from "./view/menu.js";
import EventAddBtnView from "./view/event-add-btn.js";
import TripInfoPresenter from "./presenter/trip-Info.js";
import FilterPresenter from "./presenter/filter.js";
import TripPresenter from "./presenter/trip.js";

const eventCount = getRandomInteger(2, 20);

const events = new Array(eventCount).fill().map(generateEvent).sort((a, b) => a.date.start - b.date.start);

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const filterModel = new FilterModel();

const siteHeaderTripElement = document.querySelector(`.trip-main`);
const siteHeaderControlsElement = document.querySelector(`.trip-controls`);
const siteMainTripElement = document.querySelector(`.trip-events`);

const eventAddBtnView = new EventAddBtnView();

const tripInfoPresenter = new TripInfoPresenter(siteHeaderTripElement, eventsModel);
const filterPresenter = new FilterPresenter(siteHeaderControlsElement, filterModel);
const tripPresenter = new TripPresenter(siteMainTripElement, eventsModel, filterModel, eventAddBtnView);

render(siteHeaderControlsElement, new MenuView(), RenderPosition.AFTERBEGIN);
render(siteHeaderTripElement, eventAddBtnView);

tripInfoPresenter.init();
filterPresenter.init();
tripPresenter.init();
