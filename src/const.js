export const OfferTypes = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`];

export const StorageParams = {
  PREFIX: `bigtrip-localstorage`,
  VER: `v13`,
};

export const ApiParams = {
  AUTHORIZATION: `Basic g6ser84jhdf68gy4ikf35hj18`,
  END_POINT: `https://13.ecmascript.pages.academy/big-trip`,
};

export const SortType = {
  DATE: `date`,
  TIME: `time`,
  PRICE: `price`
};

export const UserAction = {
  UPDATE_EVENT: `UPDATE_EVENT`,
  ADD_EVENT: `ADD_EVENT`,
  DELETE_EVENT: `DELETE_EVENT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

export const MenuItem = {
  TABLE: `TABLE`,
  STATS: `STATS`,
};

export const DatepickerParams = {
  dateFormat: `d/m/Y H:i`,
  enableTime: true,
  /* eslint-disable */
  time_24hr: true,
  /* eslint-enable */
};
