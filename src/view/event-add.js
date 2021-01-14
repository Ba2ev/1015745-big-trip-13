import he from 'he';
import dayjs from 'dayjs';
import flatpickr from "flatpickr";
import {OfferTypes} from './../const';
import StoreApi from '../api/storeapi.js';
import SmartView from "./smart.js";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const BLANK_EVENT = {
  type: `taxi`,
  offers: [],
  placeName: ``,
  placeText: null,
  placeImages: null,
  date: {
    start: new Date(),
    end: new Date(),
  },
  price: 0,
  isFavourite: false
};

const renderTypeList = (dataType) => {
  return `<div class="event__type-list">
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>
      ${OfferTypes.map((type) => {
    return `<div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${type}" ${type === dataType ? `checked` : ``}>
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1" data-value="${type}">${type}</label>
      </div>`;
  }).join(``)}
    </fieldset>
  </div>`;
};

const renderPlaceList = () => {
  const places = StoreApi.getPlaces().map((place) => place.name);
  return `<datalist id="destination-list-1">
    ${places.map((name) => `<option value="${name}"></option>`).join(``)}
  </datalist>`;
};

const renderOffersTemplate = (activeType, activeOffers) => {
  const {offers} = StoreApi.getOffers().find((store) => store.type === activeType);
  return `<section class="event__section event__section--offers">
  <h3 class="event__section-title event__section-title--offers">Offers</h3>
  <div class="event__available-offers">
  ${offers.map(({title, price}) => {
    const classTitle = title.split(` `).join(`-`);
    const isActiveOffer = activeOffers.find((offer) => offer.title === title) ? `checked` : ``;
    return `<div class="event__offer-selector">
    <input class="event__offer-checkbox visually-hidden" id="event-offer-${classTitle}" type="checkbox" name="event-offer-${classTitle}" ${isActiveOffer} data-value="${title}">
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

const renderDestinationTemplate = (placeText, placeImages) => {

  const text = placeText !== null ? placeText : ``;
  const imagesTemplate = placeImages !== null ? renderImagesList(placeImages) : ``;

  return `<section class="event__section event__section--destination">
  <h3 class="event__section-title event__section-title--destination">Destination</h3>
  <p class="event__destination-description">${text}</p>
  ${imagesTemplate}
</section>`;
};
const createEventAddTemplate = (data) => {
  const {type, date, price, offers, placeName, placeText, placeImages, isOffers, isText, isImages, isDisabled, isSaving, isDeleting} = data;

  const typeList = renderTypeList(type);
  const placeList = renderPlaceList();
  const dateStart = dayjs(date.start).format(`DD/MM/YY HH:mm`);
  const dateEnd = dayjs(date.end).format(`DD/MM/YY HH:mm`);
  const offersTemplate = isOffers ? renderOffersTemplate(type, offers) : ``;
  const destinationTemplate = !isText && !isImages ? `` : renderDestinationTemplate(placeText, placeImages);

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
          <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(placeName)}" list="destination-list-1">
          ${placeList}
        </div>

        <div class="event__field-group event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateStart}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateEnd}">
        </div>

        <div class="event__field-group event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input event__input--price" id="event-price-1" type="number" name="event-price" min="0" value="${he.encode(String(price))}">
        </div>

        <button class="event__save-btn btn btn--blue" type="submit" ${isDisabled ? `disabled` : ``}>${isSaving ? `saving...` : `save`}</button>
        <button class="event__reset-btn" type="reset"${isDisabled ? `disabled` : ``}>${isDeleting ? `canceling...` : `cancel`}</button>
      </header>
      <section class="event__details">
        ${offersTemplate}
        ${destinationTemplate}
      </section>
    </form>
  </li>`;
};

export default class EventAdd extends SmartView {
  constructor(event = BLANK_EVENT) {
    super();
    this._event = event;
    this._data = EventAdd.parseEventToData(event);
    this._datepicker = null;
    this._offersStore = StoreApi.getOffers();

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
        EventAdd.parseEventToData(event)
    );
  }

  getTemplate() {
    return createEventAddTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepicker();
    this.setSubmitHandler(this._callback.submit);
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
            enableTime: true,
            /* eslint-disable */
            time_24hr: true,
            /* eslint-enable */
            defaultDate: this._data.date.start,
            onChange: this._startDateChangeHandler
          }
      );
    }

    if (this._data.date.end) {
      this._datepicker = flatpickr(
          this.getElement().querySelector(`#event-end-time-1`),
          {
            dateFormat: `d/m/Y H:i`,
            enableTime: true,
            /* eslint-disable */
            time_24hr: true,
            /* eslint-enable */
            defaultDate: this._data.date.end,
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
    const {type, offers} = this._offersStore.find((store) => store.type === evt.target.dataset.value);

    this.updateData(
        {
          type,
          offers: [],
          isOffers: offers.length > 0 ? true : false,
        }
    );
  }

  _placeToggleHandler(evt) {
    evt.preventDefault();

    const newPlace = StoreApi.getPlaces().find((place) => place.name === evt.target.value);

    if (!newPlace) {
      evt.target.setCustomValidity(`Данного варианта нет в списке`);
      evt.target.reportValidity();
      return;
    }

    this.updateData(
        {
          placeName: newPlace.name,
          placeText: newPlace.description,
          placeImages: newPlace.pictures,
          isImages: newPlace.pictures ? true : false,
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
            start: dayjs(userDate).second(59).toDate(),
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
            end: dayjs(userDate).second(59).toDate(),
          }
      ),
    });
  }

  _offerChangeHandler(evt) {
    const offerName = evt.target.dataset.value;
    const {offers} = this._offersStore.find((store) => store.type === this._data.type);
    const currentOffer = offers.find((offer) => offer.title === offerName);
    const currentOffers = !this._data.offers.find((offer) => offer.title === offerName) ?
      [...this._data.offers.slice(), currentOffer] :
      this._data.offers.filter((offer) => offer.title !== offerName);

    this.updateData({
      offers: currentOffers,
    });
  }

  _submitHandler(evt) {
    evt.preventDefault();
    this._callback.submit(EventAdd.parseDataToEvent(this._data));
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EventAdd.parseDataToEvent(this._data));
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._deleteClickHandler);
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
          isText: event.placeImages !== null,
          isImages: event.placeImages !== null,
          isDisabled: false,
          isSaving: false,
          isDeleting: false
        }
    );
  }

  static parseDataToEvent(data) {
    let event = Object.assign(
        {},
        data,
        {price: Number(data.price)});

    delete event.isOffers;
    delete event.isText;
    delete event.isImages;
    delete event.isDisabled;
    delete event.isSaving;
    delete event.isDeleting;

    return event;
  }
}
