import {MenuItem, UpdateType, FilterType, ApiParams} from "./const.js";
import {render, RenderPosition, remove} from './utils/render';
import Api from './api';
import Store from './store';
import EventsModel from "./model/events.js";
import FilterModel from "./model/filter.js";
import MenuView from "./view/menu.js";
import EventAddBtnView from "./view/event-add-btn.js";
import StatisticsView from "./view/statistics.js";
import TripInfoPresenter from "./presenter/trip-Info.js";
import FilterPresenter from "./presenter/filter.js";
import TripPresenter from "./presenter/trip.js";

const api = new Api(ApiParams.END_POINT, ApiParams.AUTHORIZATION);

const eventsModel = new EventsModel();
const filterModel = new FilterModel();

const siteHeaderTripElement = document.querySelector(`.trip-main`);
const siteHeaderControlsElement = document.querySelector(`.trip-controls`);
const siteMainTripElement = document.querySelector(`.trip-events`);

const siteMenuComponent = new MenuView();
const eventAddBtnComponent = new EventAddBtnView();

const tripInfoPresenter = new TripInfoPresenter(siteHeaderTripElement, eventsModel);
const filterPresenter = new FilterPresenter(siteHeaderControlsElement, filterModel);
const tripPresenter = new TripPresenter(siteMainTripElement, eventsModel, filterModel, api);

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

tripInfoPresenter.init();
filterPresenter.init();
tripPresenter.init();

const whenEventsLoaded = api.getEvents();
const whenOffersLoaded = api.getOffers();
const whenPlacesLoaded = api.getPlaces();

Promise.all([whenEventsLoaded, whenOffersLoaded, whenPlacesLoaded])
  .then(([events, offers, places])=> {
    Store.setOffers(offers);
    Store.setPlaces(places);
    eventsModel.setEvents(UpdateType.INIT, events);
    render(siteHeaderControlsElement, siteMenuComponent, RenderPosition.AFTERBEGIN);
    render(siteHeaderTripElement, eventAddBtnComponent);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
    eventAddBtnComponent.setAddBtnClickHandler(handleAddBtnClick);
  })
  .catch(()=>{
    eventsModel.setEvents(UpdateType.INIT, []);
    render(siteHeaderControlsElement, siteMenuComponent, RenderPosition.AFTERBEGIN);
    render(siteHeaderTripElement, eventAddBtnComponent);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
    eventAddBtnComponent.setAddBtnClickHandler(handleAddBtnClick);
  });
