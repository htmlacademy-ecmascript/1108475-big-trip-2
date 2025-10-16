import AbstractView from '../framework/view/abstract-view.js';


const createFiltersTemplate = (filters) =>
  `
  <form class="trip-filters" action="#" method="get">
    ${filters.map((filter, index) => {

    const {type, pointsCount} = filter;

    return (
      `
      <div class="trip-filters__filter">
        <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${index === 0 ? 'checked' : ''} ${pointsCount === 0 ? 'disabled' : ''}>
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

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFiltersTemplate(this.#filters);
  }
}
