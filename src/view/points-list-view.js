import { createElement } from '../render.js';


const createPointsListTemplate = () =>
  `
  <ul class="trip-events__list"></ul>
  `;

export default class PointsListView {

  createTemplate() {
    return createPointsListTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.createTemplate());
    }

    return this.element;
  }
}
