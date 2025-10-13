import { mockOffers } from '../mock/offers.js';


export default class OffersModel {
  #offers = mockOffers;

  get offers() {
    return this.#offers;
  }

  getOffersByType(type) {
    const allOffers = this.offers;

    return allOffers.find((offer) => offer.type === type);
  }

  getOffersById(type, offersIds) {
    const offersByType = this.getOffersByType(type);

    return offersByType.offers.filter((offer) => offersIds.find((id) => offer.id === id));
  }
}
