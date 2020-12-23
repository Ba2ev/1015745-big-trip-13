import {MenuItem, UpdateType, FilterType, ApiParams} from "./const.js";
import {getRandomInteger} from './utils/common.js';
import {render, RenderPosition, remove} from './utils/render';
import {generateEvent} from './mock/event';
import Api from './api';
import EventsModel from "./model/events.js";
import FilterModel from "./model/filter.js";
import MenuView from "./view/menu.js";
import EventAddBtnView from "./view/event-add-btn.js";
import StatisticsView from "./view/statistics.js";
import TripInfoPresenter from "./presenter/trip-Info.js";
import FilterPresenter from "./presenter/filter.js";
import TripPresenter from "./presenter/trip.js";

const eventCount = getRandomInteger(2, 20);

const eventsMocks = new Array(eventCount).fill().map(generateEvent).sort((a, b) => a.date.start - b.date.start);

const api = new Api(ApiParams.END_POINT, ApiParams.AUTHORIZATION);

const eventsModel = new EventsModel();
eventsModel.setEvents(eventsMocks);

const filterModel = new FilterModel();

const siteHeaderTripElement = document.querySelector(`.trip-main`);
const siteHeaderControlsElement = document.querySelector(`.trip-controls`);
const siteMainTripElement = document.querySelector(`.trip-events`);

const siteMenuComponent = new MenuView();
const eventAddBtnComponent = new EventAddBtnView();

const tripInfoPresenter = new TripInfoPresenter(siteHeaderTripElement, eventsModel);
const filterPresenter = new FilterPresenter(siteHeaderControlsElement, filterModel);
const tripPresenter = new TripPresenter(siteMainTripElement, eventsModel, filterModel);

render(siteHeaderControlsElement, siteMenuComponent, RenderPosition.AFTERBEGIN);
render(siteHeaderTripElement, eventAddBtnComponent);

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statisticsComponent);
      tripPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.init();
      siteMenuComponent.setMenuItem(MenuItem.TABLE);
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      statisticsComponent = new StatisticsView(eventsModel.getEvents());
      render(siteMainTripElement, statisticsComponent, RenderPosition.BEFOREEND);
      siteMenuComponent.setMenuItem(MenuItem.STATS);
      break;
  }
};

const handleEventNewFormClose = () => {
  EventAddBtnView.enable();
  siteMenuComponent.setMenuItem(MenuItem.TABLE);
};

const handleAddBtnClick = () => {
  remove(statisticsComponent);
  tripPresenter.destroy();
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  tripPresenter.init();
  tripPresenter.createEvent(handleEventNewFormClose);
  EventAddBtnView.disable();
  siteMenuComponent.setMenuItem(MenuItem.TABLE);
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
eventAddBtnComponent.setAddBtnClickHandler(handleAddBtnClick);

tripInfoPresenter.init();
filterPresenter.init();
tripPresenter.init();

api.getEvents().then((events) => {
  eventsModel.setEvents(events);
  console.log(eventsModel.getEvents());
});
