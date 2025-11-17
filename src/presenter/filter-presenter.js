import { render, replace, remove } from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import { FiltersMap } from '../util.js';
import { UpdateType } from '../const.js';

export default class FilterPresenter {
  #filtersContainer = null;
  #filtersComponent = null;
  #filtersModel = null;
  #pointsModel = null;


  constructor(filtersContainer, filtersModel, pointsModel) {
    this.#filtersContainer = filtersContainer;
    this.#filtersModel = filtersModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#pointsModel.points;

    return [...FiltersMap].map(([filterType, filter]) => ({
      type: filterType,
      pointsCount: filter.filterPoints(points).length
    }));
  }

  init() {
    const filters = this.filters;

    const previousFiltersComponent = this.#filtersComponent;

    this.#filtersComponent = new FiltersView(filters, this.#filtersModel.filter, this.#handleFilterChange);

    if (previousFiltersComponent === null) {
      render(this.#filtersComponent, this.#filtersContainer);
      return;
    }

    replace(this.#filtersComponent, previousFiltersComponent);
    remove(previousFiltersComponent);
  }

  #handleFilterChange = (filterType) => {
    this.#filtersModel.setFilter(UpdateType.MAJOR, filterType);
  };

  #handleModelEvent = () => this.init();
}
