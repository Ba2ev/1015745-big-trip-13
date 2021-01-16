import AbstractView from "./abstract.js";

const renderFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  return (
    `<div class="trip-filters__filter">
      <input
        id="filter-${name}"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        value="${name}"
        ${type === currentFilterType ? `checked` : ``}
        ${count === 0 ? `disabled` : ``}
        >
    <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
  </div>`
  );
};

export const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => renderFilterItemTemplate(filter, currentFilterType))
    .join(``);

  return `<form class="trip-filters" action="#" method="get">
    ${filterItemsTemplate}
    </form>`;
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }
}
