import { render } from '../render.js';
import SortingView from '../view/sorting-view.js';
import PointsListView from '../view/points-list-view.js';
import PointView from '../view/point-view.js';
import PointEditFormView from '../view/point-edit-form-view.js';


export default class Presenter {
  sortingComponent = new SortingView();
  pointsListComponent = new PointsListView();

  constructor(container) {
    this.container = container;
  }

  init() {
    render(this.sortingComponent, this.container);
    render(this.pointsListComponent, this.container);
    render(new PointEditFormView(), this.pointsListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.pointsListComponent.getElement());
    }
  }
}
