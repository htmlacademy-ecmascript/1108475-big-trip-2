import { render, replace } from '../framework/render.js';
import SortingView from '../view/sorting-view.js';
import PointsListView from '../view/points-list-view.js';
import PointView from '../view/point-view.js';
import PointEditFormView from '../view/point-edit-form-view.js';

export default class Presenter {
  #sortingComponent = new SortingView();
  #pointsListComponent = new PointsListView();
  #container = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #points = [];

  constructor(container, pointsModel, offersModel, destinationsModel) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];

    this.#renderBoard();
  }

  #renderBoard() {
    render(this.#sortingComponent, this.#container);
    render(this.#pointsListComponent, this.#container);

    for (let i = 0; i < this.#points.length; i++) {
      this.#renderPoint({
        point: this.#points[i],
        offers: this.#offersModel.getOffersByType(this.#points[i].type),
        checkedOffers: [...this.#offersModel.getOffersById(this.#points[i].type, this.#points[i].offers)],
        destination: this.#destinationsModel.getDestinationById(this.#points[i].destination)
      });
    }
  }

  #renderPoint({point, offers, checkedOffers, destination}) {

    const pointComponent = new PointView({
      point, checkedOffers, destination,
      onEditOpenButtonClick: () => openEditForm()
    });

    const editFormComponent = new PointEditFormView({
      point, offers, checkedOffers, destination,
      onEditFormSubmit: () => closeEditForm(),
      onEditCloseButtonClick: () => closeEditForm()
    });

    function onDocumentKeydown (evt) {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        editFormComponent.resetForm();
        closeEditForm();
      }
    }

    function openEditForm () {
      replace(editFormComponent, pointComponent);
      document.addEventListener('keydown', onDocumentKeydown);
    }

    function closeEditForm () {
      replace(pointComponent, editFormComponent);
      document.removeEventListener('keydown', onDocumentKeydown);
    }

    render(pointComponent, this.#pointsListComponent.element);
  }
}
