import AbstractView from '../framework/view/abstract-view.js';


const createFiltersTemplate = (filters, currentFilter) =>
  `
  <form class="trip-filters" action="#" method="get">
    ${filters.map((filter) => {

    const {type, pointsCount} = filter;

    return (
      `
      <div class="trip-filters__filter">
        <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${type === currentFilter ? 'checked' : ''} ${pointsCount === 0 ? 'disabled' : ''}>
        <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
      </div>
      `
    );
  }).join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
  `;

export default class FiltersView extends AbstractView {
  #filters = [];
  #currentFilter = null;
  #handleFilterChange = null;

  constructor(filters, currentFilter, onFilterChange) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
    this.#handleFilterChange = onFilterChange;

    this.element.addEventListener('change', this.#filterChangeHandler);
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilter);
  }

  #filterChangeHandler = (evt) => {
    this.#handleFilterChange(evt.target.value);
  };
}
