import { getRandomPoints } from '../mock/points.js';

export default class PointsModel {
  #points = getRandomPoints();

  get points() {
    return this.#points;
  }
}
