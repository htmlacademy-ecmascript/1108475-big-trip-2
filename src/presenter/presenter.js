import { render } from '../render.js';
import SortingView from '../view/sorting-view.js';
import PointsListView from '../view/points-list-view.js';
import PointView from '../view/point-view.js';
import PointEditFormView from '../view/point-edit-form-view.js';

export default class Presenter {
  sortingComponent = new SortingView();
  pointsListComponent = new PointsListView();

  constructor(container, pointsModel) {
    this.container = container;
    this.pointsModel = pointsModel;
  }

  init() {
    this.points = [...this.pointsModel.getPoints()];

    render(this.sortingComponent, this.container);
    render(this.pointsListComponent, this.container);
    render(new PointEditFormView({
      point: this.points[0],
      offers: this.pointsModel.getOffersByType(this.points[0].type),
      checkedOffers: [...this.pointsModel.getOffersById(this.points[0].type, this.points[0].offers)],
      destination: this.pointsModel.getDestinationById(this.points[0].destination)
    }),
    this.pointsListComponent.getElement());

    for (let i = 1; i < this.points.length; i++) {
      render(new PointView({
        point: this.points[i],
        offers: [...this.pointsModel.getOffersById(this.points[i].type, this.points[i].offers)],
        destination: this.pointsModel.getDestinationById(this.points[i].destination)
      }),
      this.pointsListComponent.getElement());
    }
  }
}
