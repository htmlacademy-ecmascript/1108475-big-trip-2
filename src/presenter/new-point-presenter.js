import { render, remove, RenderPosition } from '../framework/render.js';
import PointEditFormView from '../view/point-edit-form-view.js';
import { UserAction, UpdateType, BLANK_POINT, BLANK_DESTINATION } from '../const.js';
import { isEscapeKey } from '../util.js';

export default class NewPointPresenter {
  #editFormComponent = null;
  #pointsListComponent = null;
  #allOffers = null;
  #allDestinations = null;
  #point = null;
  #handlePointChange = null;
  #handleNewPointDestroy = null;

  constructor(pointsListComponent, handlePointChange, handleNewPointDestroy, allOffers, allDestinations) {
    this.#pointsListComponent = pointsListComponent;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#handlePointChange = handlePointChange;
    this.#handleNewPointDestroy = handleNewPointDestroy;
  }

  init() {
    if(this.#editFormComponent !== null) {
      return;
    }

    this.#point = BLANK_POINT;

    this.#editFormComponent = new PointEditFormView({
      allOffers: this.#allOffers,
      allDestinations: this.#allDestinations,
      point: this.#point,
      offers: this.#allOffers.find((offer) => offer.type === this.#point.type).offers,
      checkedOffers: [],
      destination: BLANK_DESTINATION,
      handleEditFormSubmit: this.#handleNewPointSubmit,
      handleEditCloseButtonClick: this.#handleNewPointCloseClick,
    });

    render(this.#editFormComponent, this.#pointsListComponent.element, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#documentKeydownHandler);
  }

  destroy() {
    if (this.#editFormComponent === null) {
      return;
    }

    remove(this.#editFormComponent);
    this.#editFormComponent = null;

    document.removeEventListener('keydown', this.#documentKeydownHandler);

    this.#handleNewPointDestroy();
  }

  setSaving() {
    this.#editFormComponent.updateElement({
      formState: {
        isDisabled: true,
        isSaving: true,
        isDeleting: false,
      }
    });
  }

  setResetting() {
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

  #handleNewPointCloseClick = () => this.destroy();

  #handleNewPointSubmit = (point) => {
    document.removeEventListener('keydown', this.#documentKeydownHandler);
    delete point.id;
    this.#handlePointChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #documentKeydownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };
}
