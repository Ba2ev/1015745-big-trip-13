export default class StoreApi {
  constructor() {
    this._offers = null;
    this._places = null;
  }

  static setOffers(offers) {
    this._offers = offers;
  }

  static setPlaces(places) {
    this._places = places;
  }

  static getOffers() {
    return this._offers;
  }

  static getTypeOffers(offersType) {
    return this._offers.find((store) => store.type === offersType);
  }

  static getPlaces() {
    return this._places;
  }
}
