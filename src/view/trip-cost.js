import AbstractView from "./abstract.js";

const createTripCostTemplate = (events) => {
  const price = events.reduce((acc, event) => {
    const offersPrice = event.offers !== null ? event.offers.reduce((sum, offer) => sum + offer.price, 0) : 0;
    return acc + event.price + offersPrice;
  }, 0);
  return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
  </p>`;
};

export default class TripCost extends AbstractView {
  constructor(events = []) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createTripCostTemplate(this._events);
  }
}
