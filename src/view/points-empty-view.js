import AbstractView from '../framework/view/abstract-view.js';
import { FiltersMap } from '../util.js';


const createPointsEmptyTemplate = (filterType) =>
  `
  <p class="trip-events__msg">${FiltersMap.get(filterType).empty}</p>
  `;

export default class PointsEmptyView extends AbstractView {
  #filter = null;

  constructor(filter) {
    super();
    this.#filter = filter;
  }

  get template() {
    return createPointsEmptyTemplate(this.#filter);
  }
}
