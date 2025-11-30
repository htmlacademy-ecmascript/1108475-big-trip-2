import { render, replace, remove } from '../framework/render.js';
import PointView from '../view/point-view.js';
import PointEditFormView from '../view/point-edit-form-view.js';
import { UserAction, UpdateType } from '../const.js';
import { isEscapeKey, areDatesEqual } from '../util.js';

export default class PointPresenter {
  #pointComponent = null;
  #editFormComponent = null;
  #pointsListContainer = null;
  #allOffers = null;
  #allDestinations = null;
  #point = null;
  #offers = null;
  #checkedOffers = null;
  #destination = null;
  #handlePointChange = null;
  #resetPointsEditing = null;
  #isEditing = false;

  constructor(container, handlePointChange, resetPointsEditing, allOffers, allDestinations) {
    this.#pointsListContainer = container;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#handlePointChange = handlePointChange;
    this.#resetPointsEditing = resetPointsEditing;
  }

  get offers() {
    return this.#allOffers.find((offer) => offer.type === this.#point.type).offers;
  }

  get checkedOffers() {
    return this.#offers.filter((offer) => this.#point.offers.find((id) => offer.id === id));
  }

  get destination() {
    return this.#allDestinations.find((destination) => destination.id === this.#point.destination);
  }

  init(point) {

    this.#point = point;

    this.#offers = this.offers;
    this.#checkedOffers = this.checkedOffers;
    this.#destination = this.destination;

    const previousPointComponent = this.#pointComponent;
    const previousEditFormComponent = this.#editFormComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      checkedOffers: this.#checkedOffers,
      destination: this.#destination,
      handleEditOpenButtonClick: this.#handleEditClick,
      handleFavoriteButtonClick: this.#handleFavoriteChange
    });

    this.#editFormComponent = new PointEditFormView({
      allOffers: this.#allOffers,
      allDestinations: this.#allDestinations,
      point: this.#point,
      offers: this.#offers,
      checkedOffers: this.#checkedOffers,
      destination: this.#destination,
      handleEditFormSubmit: this.#handleEditFormSubmit,
      handleEditCloseButtonClick: this.#handleEditCloseClick,
      handleEditDeleteButtonClick: this.#handleDeleteClick
    });

    if (previousPointComponent === null || previousEditFormComponent === null) {
      render(this.#pointComponent, this.#pointsListContainer);
      return;
    }

    if (!this.#isEditing) {
      replace(this.#pointComponent, previousPointComponent);
    } else {
      replace(this.#pointComponent, previousEditFormComponent);
      this.#isEditing = false;
    }

    remove(previousPointComponent);
    remove(previousEditFormComponent);
  }

  clear() {
    remove(this.#pointComponent);
    remove(this.#editFormComponent);
  }

  resetEditing() {
    if (this.#isEditing) {
      this.#editFormComponent.reset();
      this.#closeEditForm();
    }
  }

  setSaving() {
    if (!this.#isEditing) {
      this.#pointComponent.disable();
      return;
    }

    this.#editFormComponent.updateElement({
      formState: {
        isDisabled: true,
        isSaving: true,
        isDeleting: false,
      }
    });
  }

  setDeleting() {
    if (this.#isEditing) {
      this.#editFormComponent.updateElement({
        formState: {
          isDisabled: true,
          isSaving: false,
          isDeleting: true,
        }
      });
    }
  }

  setResetting() {
    if (!this.#isEditing) {
      this.#pointComponent.shake(() => this.#pointComponent.enable());
      return;
    }

    this.#editFormComponent.shake(() => {
      this.#editFormComponent.updateElement({
        formState: {
          isDisabled: false,
          isSaving: false,
          isDeleting: false,
        }
      });
      document.addEventListener('keydown', this.#documentKeydownHandler);
    });
  }

  #openEditForm() {
    replace(this.#editFormComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#documentKeydownHandler);
    this.#isEditing = true;
  }

  #closeEditForm() {
    replace(this.#pointComponent, this.#editFormComponent);
    document.removeEventListener('keydown', this.#documentKeydownHandler);
    this.#isEditing = false;
  }

  #handleEditClick = () => {
    this.#resetPointsEditing();
    this.#openEditForm();
  };

  #handleEditCloseClick = () => {
    this.#editFormComponent.reset();
    this.#closeEditForm();
  };

  #handleEditFormSubmit = (update) => {
    document.removeEventListener('keydown', this.#documentKeydownHandler);
    const isMinorUpdate =
      !areDatesEqual(this.#point.dateFrom, update.dateFrom) ||
      !areDatesEqual(this.#point.dateTo, update.dateTo) ||
      this.#point.basePrice !== update.basePrice;

    this.#handlePointChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
  };

  #handleDeleteClick = (point) => {
    document.removeEventListener('keydown', this.#documentKeydownHandler);
    this.#handlePointChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleFavoriteChange = () => {
    this.#handlePointChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite},
    );
  };

  #documentKeydownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#editFormComponent.reset();
      this.#closeEditForm();
    }
  };
}
