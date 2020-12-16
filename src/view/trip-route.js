import AbstractView from "./abstract.js";
import dayjs from 'dayjs';

const createTripRouteTemplate = (events) => {
  const eventRoutes = [...new Set([...events.map((event) => event.placeName)])];
  const eventStartDate = events[0].date.start;
  const eventEndDate = events[events.length - 1].date.end;

  const route = eventRoutes.length > 3 ? `${eventRoutes[0]} &mdash; ... &mdash; ${eventRoutes[eventRoutes.length - 1]}` : eventRoutes.join(` &mdash; `);

  const period = dayjs(eventStartDate).month() === dayjs(eventEndDate).month() ? `${dayjs(eventStartDate).format(`MMM DD`)}&nbsp;&mdash;&nbsp;${dayjs(eventEndDate).format(`DD`)}` : `${dayjs(eventStartDate).format(`MMM DD`)}&nbsp;&mdash;&nbsp;${dayjs(eventEndDate).format(`MMM DD`)}`;

  return `<div class="trip-info__main">
      <h1 class="trip-info__title">${route}</h1>
      <p class="trip-info__dates">${period}</p>
    </div>`;
};


export default class TripRoute extends AbstractView {
  constructor(events = []) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createTripRouteTemplate(this._events);
  }
}
