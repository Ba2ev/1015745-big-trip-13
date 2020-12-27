import Observer from "../utils/observer.js";

export default class Events extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(updateType, events) {
    this._events = events.slice();
    this._notify(updateType);
  }

  getEvents() {
    return this._events;
  }

  updateEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting event`);
    }

    this._events = [
      ...this._events.slice(0, index),
      update,
      ...this._events.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this._events = [
      update,
      ...this._events
    ];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting event`);
    }

    this._events = [
      ...this._events.slice(0, index),
      ...this._events.slice(index + 1)
    ];

    this._notify(updateType);
  }

  static adaptToClient(event) {
    const adaptedEvent = Object.assign(
        {},
        event,
        {
          date: {
            start: event.date_from,
            end: event.date_to,
          },
          isFavourite: event.is_favorite,
          price: event.base_price,
          placeName: event.destination.name,
          placeText: event.destination.description,
          placeImages: event.destination.pictures,
        }
    );

    delete adaptedEvent.base_price;
    delete adaptedEvent.date_from;
    delete adaptedEvent.date_to;
    delete adaptedEvent.destination;
    delete adaptedEvent.is_favorite;

    return adaptedEvent;
  }

  static adaptToServer(event) {
    const adaptedEvent = Object.assign(
        {},
        event,
        {
          "date_from": event.date.start,
          "date_to": event.date.end,
          "destination": {
            "name": event.placeName,
            "description": event.placeText,
            "pictures": event.placeImages
          },
          "is_favorite": event.isFavourite,
          "base_price": event.price
        }
    );

    delete adaptedEvent.date;
    delete adaptedEvent.isFavourite;
    delete adaptedEvent.placeImages;
    delete adaptedEvent.placeName;
    delete adaptedEvent.placeText;
    delete adaptedEvent.price;

    return adaptedEvent;
  }
}
