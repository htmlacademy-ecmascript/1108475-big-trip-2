import { render, replace, remove } from '../framework/render.js';
import PointView from '../view/point-view.js';
import PointEditFormView from '../view/point-edit-form-view.js';

export default class PointPresenter {
  #pointComponent = null;
  #editFormComponent = null;
  #pointsListContainer = null;
  #allOffers = null;
  #allDestinations = null;
  #point = null;
  #pointOffers = null;
  #pointCheckedOffers = null;
  #pointDestination = null;
  #onPointChange = null;
  #resetPointsEditing = null;
  #sortPoints = null;
  #isEditing = false;

  constructor(container, handlePointChange, resetPointsEditing, sortPoints, allOffers, allDestinations) {
    this.#pointsListContainer = container;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#onPointChange = handlePointChange;
    this.#resetPointsEditing = resetPointsEditing;
    this.#sortPoints = sortPoints;
  }

  init({point, offers, checkedOffers, destination}) {

    this.#point = point;
    this.#pointOffers = offers;
    this.#pointCheckedOffers = checkedOffers;
    this.#pointDestination = destination;

    const previousPointComponent = this.#pointComponent;
    const previousEditFormComponent = this.#editFormComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      checkedOffers: this.#pointCheckedOffers,
      destination: this.#pointDestination,
      onEditOpenButtonClick: () => {
        this.#resetPointsEditing();
        this.#openEditForm();
      },
      onFavoriteButtonClick: () => this.#handleFavoriteChange()
    });

    this.#editFormComponent = new PointEditFormView({
      allOffers: this.#allOffers,
      allDestinations: this.#allDestinations,
      point: this.#point,
      offers: this.#pointOffers,
      checkedOffers: this.#pointCheckedOffers,
      destination: this.#pointDestination,
      onEditFormSubmit: this.#handleEditFormSubmit,
      onEditCloseButtonClick: () => this.#closeEditForm()
    });

    if (previousPointComponent === null || previousEditFormComponent === null) {
      render(this.#pointComponent, this.#pointsListContainer);
      return;
    }

    if (this.#pointsListContainer.contains(previousPointComponent.element)) {
      replace(this.#pointComponent, previousPointComponent);
    }

    if (this.#pointsListContainer.contains(previousEditFormComponent.element)) {
      replace(this.#editFormComponent, previousEditFormComponent);
    }

    remove(previousPointComponent);
    remove(previousEditFormComponent);
  }

  clear() {
    remove(this.#pointComponent);
    remove(this.#editFormComponent);
  }

  #openEditForm() {
    this.#isEditing = true;
    replace(this.#editFormComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#documentKeydownHandler);
  }

  #closeEditForm() {
    this.#isEditing = false;
    replace(this.#pointComponent, this.#editFormComponent);
    document.removeEventListener('keydown', this.#documentKeydownHandler);
  }

  #handleEditFormSubmit = (point) => {
    this.#onPointChange(point);
    this.#closeEditForm();
    this.#sortPoints();
  };

  #handleFavoriteChange = () => {
    this.#onPointChange({ ...this.#point, isFavorite: !this.#point.isFavorite});
  };

  resetEditing() {
    if (this.#isEditing === true) {
      this.#editFormComponent.reset(this.#point, this.#pointOffers, this.#pointCheckedOffers, this.#pointDestination);
      this.#closeEditForm();
    }
  }


  #documentKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#editFormComponent.reset(this.#point, this.#pointOffers, this.#pointCheckedOffers, this.#pointDestination);
      this.#closeEditForm();
    }
  };
}
