import { render, replace, remove } from '../framework/render.js';
import PointView from '../view/point-view.js';
import PointEditFormView from '../view/point-edit-form-view.js';

export default class PointPresenter {
  #pointComponent = null;
  #editFormComponent = null;
  #pointsListContainer = null;
  #point = null;
  #pointOffers = null;
  #pointCheckedOffers = null;
  #pointDestination = null;
  #onPointChange = null;
  #resetPointsEditing = null;
  #isEditing = false;

  constructor(container, handlePointChange, resetPointsEditing, offers, checkedOffers, destination) {
    this.#pointsListContainer = container;
    this.#pointOffers = offers;
    this.#pointCheckedOffers = checkedOffers;
    this.#pointDestination = destination;
    this.#onPointChange = handlePointChange;
    this.#resetPointsEditing = resetPointsEditing;
  }

  init(point) {

    this.#point = point;

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
      point: this.#point,
      offers: this.#pointOffers,
      checkedOffers: this.#pointCheckedOffers,
      destination: this.#pointDestination,
      onEditFormSubmit: () => this.#closeEditForm(),
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

  #handleFavoriteChange = () => {
    this.#onPointChange({ ...this.#point, isFavorite: !this.#point.isFavorite});
  };

  resetEditing() {
    if (this.#isEditing === true) {
      this.#closeEditForm();
    }
  }


  #documentKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#editFormComponent.resetForm();
      this.#closeEditForm();
    }
  };
}
