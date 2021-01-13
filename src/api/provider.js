import StoreApi from './storeapi.js';
import EventsModel from "../model/events.js";
import {isOnline} from "../utils/common.js";

const getSyncedEvents = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getEvents() {
    if (isOnline()) {
      return this._api.getEvents()
        .then((events) => {
          const items = createStoreStructure(events.map(EventsModel.adaptToServer));
          this._store.setItems(items);
          return events;
        });
    }

    const storeEvents = Object.values(this._store.getItems());

    return Promise.resolve(storeEvents.map(EventsModel.adaptToClient));
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._store.setAdditionalDataByKey(`offers`, offers);
          return offers;
        });
    }

    const storeOffers = this._store.getAdditionalDataByKey(`offers`);

    return Promise.resolve(storeOffers);
  }

  getPlaces() {
    if (isOnline()) {
      return this._api.getPlaces()
        .then((places) => {
          this._store.setAdditionalDataByKey(`places`, places);
          return places;
        });
    }

    const storePlaces = this._store.getAdditionalDataByKey(`places`);

    return Promise.resolve(storePlaces);
  }

  getAllData() {
    return Promise.all([this.getEvents(), this.getOffers(), this.getPlaces()])
    .then(([events, offers, places]) => {
      StoreApi.setOffers(offers);
      StoreApi.setPlaces(places);
      return Promise.resolve(events);
    });
  }

  updateEvent(event) {
    if (isOnline()) {
      return this._api.updateEvent(event)
        .then((updatedEvent) => {
          this._store.setItem(updatedEvent.id, EventsModel.adaptToServer(updatedEvent));
          return updatedEvent;
        });
    }

    this._store.setItem(event.id, EventsModel.adaptToServer(Object.assign({}, event)));

    return Promise.resolve(event);
  }

  addEvent(event) {
    if (isOnline()) {
      return this._api.addEvent(event)
        .then((newEvent) => {
          this._store.setItem(newEvent.id, EventsModel.adaptToServer(newEvent));
          return newEvent;
        });
    }

    return Promise.reject(new Error(`Add event failed`));
  }

  deleteEvent(event) {
    if (isOnline()) {
      return this._api.deleteEvent(event)
        .then(() => this._store.removeItem(event.id));
    }

    return Promise.reject(new Error(`Delete event failed`));
  }

  sync() {
    if (isOnline()) {

      const storeEvents = Object.values(this._store.getItems());

      return this._api.sync(storeEvents)
        .then((response) => {

          const createdEvents = getSyncedEvents(response.created);
          const updatedEvents = getSyncedEvents(response.updated);

          const items = createStoreStructure([...createdEvents, ...updatedEvents]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
