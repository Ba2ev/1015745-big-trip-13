import FilterView from "../view/filter.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {filter} from "../utils/filter.js";
import {FilterType, UpdateType} from "../const.js";

export default class Filter {
  constructor(filterContainer, filterModel, eventModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._eventModel = eventModel;

    this._currentFilter = null;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
    this._eventModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._currentFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const events = this._eventModel.getEvents();

    return [
      {
        type: FilterType.EVERYTHING,
        name: `everything`,
        count: filter[FilterType.EVERYTHING](events).length,
      },
      {
        type: FilterType.FUTURE,
        name: `future`,
        count: filter[FilterType.FUTURE](events).length,
      },
      {
        type: FilterType.PAST,
        name: `past`,
        count: filter[FilterType.PAST](events).length,
      },
    ];
  }
}
