import {MenuItem, UpdateType, FilterType, ApiParams, StorageParams} from "./const.js";
import {toast} from "./utils/toast/toast.js";
import {isOnline} from "./utils/common.js";
import {render, RenderPosition, remove} from './utils/render';
import Storage from "./api/storage.js";
import Provider from "./api/provider.js";
import Api from './api/api.js';
import EventsModel from "./model/events.js";
import FilterModel from "./model/filter.js";
import MenuView from "./view/menu.js";
import EventAddBtnView from "./view/event-add-btn.js";
import StatisticsView from "./view/statistics.js";
import TripInfoPresenter from "./presenter/trip-Info.js";
import FilterPresenter from "./presenter/filter.js";
import TripPresenter from "./presenter/trip.js";

const storageName = `${StorageParams.PREFIX}-${StorageParams.VER}`;

const api = new Api(ApiParams.END_POINT, ApiParams.AUTHORIZATION);

const storage = new Storage(storageName, window.localStorage);
const apiWithProvider = new Provider(api, storage);

const eventsModel = new EventsModel();
const filterModel = new FilterModel();

const siteHeaderTripElement = document.querySelector(`.trip-main`);
const siteHeaderControlsElement = document.querySelector(`.trip-controls`);
const siteMainTripElement = document.querySelector(`.trip-events`);

const siteMenuComponent = new MenuView();
const eventAddBtnComponent = new EventAddBtnView();

const tripInfoPresenter = new TripInfoPresenter(siteHeaderTripElement, eventsModel);
const filterPresenter = new FilterPresenter(siteHeaderControlsElement, filterModel, eventsModel);
const tripPresenter = new TripPresenter(siteMainTripElement, eventsModel, filterModel, apiWithProvider);

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
  if (!isOnline()) {
    toast(`You can't create new event offline`);
    siteMenuComponent.setMenuItem(MenuItem.TABLE);
    return;
  }
  tripPresenter.createEvent(handleEventNewFormClose);
  EventAddBtnView.disable();
  siteMenuComponent.setMenuItem(MenuItem.TABLE);
};

tripInfoPresenter.init();
filterPresenter.init();
tripPresenter.init();

apiWithProvider.getAllData()
  .then((events)=> {
    eventsModel.setEvents(UpdateType.INIT, events);
  })
  .catch(()=>{
    eventsModel.setEvents(UpdateType.INIT, []);
  })
  .finally(() => {
    render(siteHeaderControlsElement, siteMenuComponent, RenderPosition.AFTERBEGIN);
    render(siteHeaderTripElement, eventAddBtnComponent);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
    eventAddBtnComponent.setAddBtnClickHandler(handleAddBtnClick);
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
