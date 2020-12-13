import SmartView from "./smart.js";
import dayjs from 'dayjs';
import {eventData} from '../mock/eventData';
import {generateOffers, generateDescriptionText, generateDescriptionImages} from '../mock/event';

const BLANK_EVENT = {
  type: `taxi`,
  offers: null,
  place: {
    name: ``,
    text: ``,
    images: null,
  },
  date: {
    start: ``,
    end: ``,
  },
  price: ``,
  isFavorite: false
};

const renderPlaceList = () => {
  return `<datalist id="destination-list-1">
    ${eventData.places.map((item) => `<option value="${item}"></option>`).join(``)}
  </datalist>`;
};

const renderOffersTemplate = (offers) => {
  return `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  <div class="event__available-offers">
  ${offers.map(({name, price, isActive}) => {
    return `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" ${isActive ? `checked` : ``}>
    <label class="event__offer-label" for="event-offer-luggage-1">
      <span class="event__offer-title">${name}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>`;
  }).join(``)}
  </div>
  </section>`;
};

const renderImagesList = (imageList) => {
  return `<div class="event__photos-container">
  <div class="event__photos-tape">
    ${imageList.map((imageLink) => `<img class="event__photo" src="${imageLink}" alt="Event photo">`)}
  </div>
</div>`;
};

const createEventEditTemplate = (data) => {
  const {type, date, price, offers, place, isOffers, isImages} = data;

  const placeList = renderPlaceList();
  const dateStart = dayjs(date.start).format(`DD/MM/YY HH:mm`);
  const dateEnd = dayjs(date.end).format(`DD/MM/YY HH:mm`);
  const offersTemplate = isOffers ? renderOffersTemplate(offers) : ``;
  const imagesTemplate = isImages ? renderImagesList(place.images) : ``;

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              <div class="event__type-item">
                <input id="event-type-taxi-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="taxi">
                <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-bus-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="bus">
                <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-train-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="train">
                <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-ship-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="ship">
                <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-transport-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="transport">
                <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-drive-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="drive">
                <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-flight-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="flight" checked>
                <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-check-in-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="check-in">
                <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-sightseeing-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="sightseeing">
                <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-restaurant-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="restaurant">
                <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
              </div>
            </fieldset>
          </div>
        </div>

        <div class="event__field-group event__field-group--destination">
          <label class="event__label event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${place.name}" list="destination-list-1">
          ${placeList}
        </div>

        <div class="event__field-group event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateStart}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateEnd}">
        </div>

        <div class="event__field-group event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn btn btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${offersTemplate}
        <section class="event__section event__section--destination">
          <h3 class="event__section-title event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${place.text}</p>
          ${imagesTemplate}
        </section>
      </section>
    </form>
  </li>`;
};

export default class EventEdit extends SmartView {
  constructor(event = BLANK_EVENT) {
    super();
    this._event = event;
    this._data = EventEdit.parseEventToData(event);

    this._rollupClickHandler = this._rollupClickHandler.bind(this);
    this._submitHandler = this._submitHandler.bind(this);
    this._typeToggleHandler = this._typeToggleHandler.bind(this);
    this._placeToggleHandler = this._placeToggleHandler.bind(this);

    this._setInnerHandlers();
  }

  reset(event) {
    this.updateData(
        EventEdit.parseEventToData(event)
    );
  }

  getTemplate() {
    return createEventEditTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setSubmitHandler(this._callback.submit);
    this.setRollupClickHandler(this._callback.rollupClick);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.event__type-group`)
      .addEventListener(`click`, this._typeToggleHandler);
    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._placeToggleHandler);
  }

  _typeToggleHandler({target}) {
    const newOffers = generateOffers(target.textContent);

    this.updateData(Object.assign(
        {},
        this._event,
        {
          type: target.textContent,
          offers: newOffers,
        }
    )
    );

  }

  _placeToggleHandler({target}) {
    if (target.value !== ``) {
      this.updateData({
        place: Object.assign(
            {},
            this._event.place,
            {
              name: target.value,
              text: generateDescriptionText(),
              images: generateDescriptionImages(),
            }
        )
      }
      );
    }
  }

  _rollupClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollupClick();
  }

  _submitHandler(evt) {
    evt.preventDefault();
    this._callback.submit(EventEdit.parseDataToEvent(this._data));
  }

  setRollupClickHandler(callback) {
    this._callback.rollupClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._rollupClickHandler);
  }

  setSubmitHandler(callback) {
    this._callback.submit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._submitHandler);
  }

  static parseEventToData(event) {
    return Object.assign(
        {},
        event,
        {
          isOffers: event.offers !== null,
          isImages: event.place.images !== null,
        }
    );
  }

  static parseDataToEvent(data) {
    data = Object.assign({}, data);

    delete data.isOffers;
    delete data.isImages;

    return data;
  }
}
