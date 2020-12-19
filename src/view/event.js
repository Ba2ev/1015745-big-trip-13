import he from 'he';
import dayjs from 'dayjs';
import {getDateTimeFormat, getEventDuration} from '../utils/event';
import AbstractView from "./abstract.js";

const renderOffers = (offers) => {
  const activeOffers = Object.entries(offers).filter(([, param]) => param.isActive);
  return `<h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
  ${activeOffers.map(([name, param]) => {
    return `<li class="event__offer">
        <span class="event__offer-title">${name}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${param.price}</span>
      </li>`;
  }).join(``)}
  </ul>`;
};

const createEventTemplate = (eventItem) => {
  const {type, placeName, date, price, offers, isFavourite} = eventItem;

  const shortDate = dayjs(date.start).format(`MMM DD`);

  const dateStart = dayjs(date.start).format(`HH:mm`);
  const dateEnd = dayjs(date.end).format(`HH:mm`);

  const duration = getEventDuration(date.start, date.end);

  const offersTemplate = offers === null ? `` : renderOffers(offers);

  const favouriteClass = isFavourite ? `event__favorite-btn--active` : ``;

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime=${getDateTimeFormat(date.start, false)}>${shortDate}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${placeName}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime=${getDateTimeFormat(date.start, true)}>${dateStart}</time>
          &mdash;
          <time class="event__end-time" datetime=${getDateTimeFormat(date.end, true)}>${dateEnd}</time>
        </p>
        <p class="event__duration">${duration}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${he.encode(String(price))}</span>
      </p>
      ${offersTemplate}
      <button class="event__favorite-btn ${favouriteClass}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class Event extends AbstractView {
  constructor(event) {
    super();
    this._event = event;
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._rollupClickHandler = this._rollupClickHandler.bind(this);
  }

  getTemplate() {
    return createEventTemplate(this._event);
  }

  _rollupClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollupClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteClickHandler);
  }

  setRollupClickHandler(callback) {
    this._callback.rollupClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._rollupClickHandler);
  }
}
