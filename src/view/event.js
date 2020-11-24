import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';

dayjs.extend(durationPlugin);

const getDateTimeFormat = (date, isTime) => {
  return isTime ? dayjs(date).format(`YYYY-MM-DD[T]HH:mm`) : dayjs(date).format(`YYYY-MM-DD`);
};

const getEventDuration = (dateStart, dateEnd) => {
  const diff = dayjs(dateEnd).diff(dayjs(dateStart));
  const days = dayjs.duration(diff).days().toString();
  const hours = dayjs.duration(diff).hours().toString();
  const minutes = dayjs.duration(diff).minutes().toString();

  return `${days > 0 ? days + `D` : ''} ${hours > 0 ? hours.padStart(2, `0`) + `H` : ``} ${minutes.padStart(2, `0`)}M`;
};

const renderOffers = (offers) => {
  return `<h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
    ${offers.map(({name, price}) => {
    return `<li class="event__offer">
        <span class="event__offer-title">${name}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </li>`;
  }).join(``)}
  </ul>`;
};

export const createEventTemplate = (eventItem) => {
  const {event, date, price, offers, isFavourite} = eventItem;

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
        <img class="event__type-icon" width="42" height="42" src="img/icons/taxi.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${event.type} ${event.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime=${getDateTimeFormat(date.start, true)}>${dateStart}</time>
          &mdash;
          <time class="event__end-time" datetime=${getDateTimeFormat(date.end, true)}>${dateEnd}</time>
        </p>
        <p class="event__duration">${duration}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
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
