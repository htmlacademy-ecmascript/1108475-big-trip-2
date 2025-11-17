import { mockOffers } from '../mock/offers.js';


export default class OffersModel {
  #offers = mockOffers;

  get offers() {
    return this.#offers;
  }
}
