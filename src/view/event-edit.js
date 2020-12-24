import he from 'he';
import dayjs from 'dayjs';
import flatpickr from "flatpickr";
import Store from '../store';
import SmartView from "./smart.js";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const BLANK_EVENT = {
  type: `taxi`,
  offers: [],
  placeName: ``,
  placeText: ``,
  placeImages: null,
  date: {
    start: ``,
    end: ``,
  },
  price: ``,
  isFavorite: false
};

const renderTypeList = (dataType) => {
  const types = Store.getOffers().map((offer) => offer.type);
  return `<div class="event__type-list">
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>
      ${types.map((type) => {
    return `<div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${type}" ${type === dataType ? `checked` : ``}>
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
      </div>`;
  }).join(``)}
    </fieldset>
  </div>`;
};

const renderPlaceList = () => {
  const places = Store.getPlaces().map((place) => place.name);
  return `<datalist id="destination-list-1">
    ${places.map((name) => `<option value="${name}"></option>`).join(``)}
  </datalist>`;
};

const renderOffersTemplate = (activeType, activeOffers) => {
  const currentOffersStore = Store.getOffers().find((store) => store.type === activeType);
  return `<section class="event__section event__section--offers">
  <h3 class="event__section-title event__section-title--offers">Offers</h3>
  <div class="event__available-offers">
  ${currentOffersStore.offers.map(({title, price}) => {
    const classTitle = title.split(` `).join(`-`);
    const isActiveOffer = activeOffers.find((offer) => offer.title === title) ? `checked` : ``;
    return `<div class="event__offer-selector">
    <input class="event__offer-checkbox visually-hidden" id="event-offer-${classTitle}" type="checkbox" name="event-offer-${classTitle}" ${isActiveOffer} data-value=${classTitle} ">
    <label class="event__offer-label" for="event-offer-${classTitle}">
      <span class="event__offer-title">${title}</span>
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
    ${imageList.map((image) => `<img class="event__photo" src="${image.src}" alt="${image.description}">`)}
  </div>
</div>`;
};

const createEventEditTemplate = (data) => {
  const {type, date, price, offers, placeName, placeText, placeImages, isOffers, isImages} = data;

  const typeList = renderTypeList(type);
  const placeList = renderPlaceList();
  const dateStart = dayjs(date.start).format(`DD/MM/YY HH:mm`);
  const dateEnd = dayjs(date.end).format(`DD/MM/YY HH:mm`);
  const offersTemplate = isOffers ? renderOffersTemplate(type, offers) : ``;
  const imagesTemplate = isImages ? renderImagesList(placeImages) : ``;

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">
          ${typeList}
        </div>

        <div class="event__field-group event__field-group--destination">
          <label class="event__label event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${placeName}" list="destination-list-1">
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
          <input class="event__input event__input--price" id="event-price-1" type="number" name="event-price" min="0" value="${he.encode(String(price))}">
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
          <p class="event__destination-description">${placeText}</p>
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
    this._datepicker = null;

    this._rollupClickHandler = this._rollupClickHandler.bind(this);
    this._submitHandler = this._submitHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._typeToggleHandler = this._typeToggleHandler.bind(this);
    this._placeToggleHandler = this._placeToggleHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._offerChangeHandler = this._offerChangeHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepicker();
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
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
    this._setDatepicker();
    this.setSubmitHandler(this._callback.submit);
    this.setRollupClickHandler(this._callback.rollupClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _setDatepicker() {
    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }

    if (this._data.date.start) {
      this._datepicker = flatpickr(
          this.getElement().querySelector(`#event-start-time-1`),
          {
            dateFormat: `d/m/Y H:i`,
            defaultDate: this._data.start,
            onChange: this._startDateChangeHandler
          }
      );
    }

    if (this._data.date.end) {
      this._datepicker = flatpickr(
          this.getElement().querySelector(`#event-end-time-1`),
          {
            dateFormat: `d/m/Y H:i`,
            defaultDate: this._data.end,
            onChange: this._endDateChangeHandler
          }
      );
    }
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.event__type-group`)
      .addEventListener(`click`, this._typeToggleHandler);
    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._placeToggleHandler);
    this.getElement()
      .querySelector(`.event__input--price`)
      .addEventListener(`change`, this._priceChangeHandler);
    if (this._data.isOffers) {
      this.getElement()
          .querySelector(`.event__section--offers`)
          .addEventListener(`change`, this._offerChangeHandler);
    }
  }

  _typeToggleHandler(evt) {
    const currentOffersStore = Store.getOffers().find((store) => store.type === evt.target.textContent);
    const offers = currentOffersStore.offers;

    this.updateData(
        {
          type: evt.target.textContent,
          offers: [],
          isOffers: offers.length > 0 ? true : false,
        }
    );
  }

  _placeToggleHandler(evt) {
    evt.preventDefault();

    const newPlace = Store.getPlaces().find((place) => place.name === evt.target.value);

    if (!newPlace) {
      evt.target.setCustomValidity(`Данного варианта нет в списке`);
      evt.target.reportValidity();
      return;
    }

    const placeText = newPlace.description;
    const placeImages = newPlace.pictures;

    this.updateData(
        {
          placeName: evt.target.value,
          placeText,
          placeImages,
          isImages: placeImages ? true : false,
        }
    );
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    evt.target.reportValidity();

    this.updateData(
        {
          price: evt.target.value,
        }, true);
  }

  _startDateChangeHandler([userDate]) {
    this.updateData({
      date: Object.assign(
          {},
          this._data.date,
          {
            start: dayjs(userDate).hour(23).minute(59).second(59).toDate(),
          }
      ),
    });
  }

  _endDateChangeHandler([userDate]) {
    this.updateData({
      date: Object.assign(
          {},
          this._data.date,
          {
            end: dayjs(userDate).hour(23).minute(59).second(59).toDate(),
          }
      ),
    });
  }

  _offerChangeHandler(evt) {
    const activeOffers = this._data.offers;
    const typeOffers = Store.getOffers().find((store) => store.type === this._data.type).offers;
    const offerDataValue = evt.target.dataset.value.split(`-`).join(` `);
    const currentOffer = typeOffers.find((offer) => offer.title === offerDataValue);
    const equalOffer = this._data.offers.filter((offer) => offer.title === currentOffer.title);

    if (equalOffer.length === 0) {
      activeOffers.push(currentOffer);
    } else {
      const index = activeOffers.indexOf(currentOffer);
      activeOffers.splice(index, 1);
    }

    this.updateData({
      offers: activeOffers,
    });
  }

  _rollupClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollupClick();
  }

  _submitHandler(evt) {
    evt.preventDefault();
    this._callback.submit(EventEdit.parseDataToEvent(this._data));
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EventEdit.parseDataToEvent(this._data));
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._deleteClickHandler);
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
          isOffers: event.offers.length > 0,
          isImages: event.placeImages !== null,
        }
    );
  }

  static parseDataToEvent(data) {
    let event = Object.assign({}, data);

    delete event.isOffers;
    delete event.isImages;

    return event;
  }
}
