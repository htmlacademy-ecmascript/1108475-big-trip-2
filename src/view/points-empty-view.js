import AbstractView from '../framework/view/abstract-view.js';
import { FilterEmptyMap } from '../const.js';


const createPointsEmptyTemplate = (filterValue) =>
  `
  <p class="trip-events__msg">${FilterEmptyMap.get(filterValue)}</p>
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
