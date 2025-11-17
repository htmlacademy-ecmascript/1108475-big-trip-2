import { mockDestinations } from '../mock/destinations.js';

export default class DestinationsModel {
  #destinations = mockDestinations;

  get destinations() {
    return this.#destinations;
  }
}
