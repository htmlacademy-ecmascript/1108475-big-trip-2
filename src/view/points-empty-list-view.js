import AbstractView from '../framework/view/abstract-view.js';
import { FiltersMap } from '../util.js';


const createPointsEmptyListTemplate = (filterType) =>
  `
  <p class="trip-events__msg">${FiltersMap.get(filterType).empty}</p>
  `;

export default class PointsEmptyListView extends AbstractView {
  #filter = null;

  constructor(filter) {
    super();
    this.#filter = filter;
  }

  get template() {
    return createPointsEmptyListTemplate(this.#filter);
  }
}
