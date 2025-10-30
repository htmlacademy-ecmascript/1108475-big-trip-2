import { mockDestinations } from '../mock/destinations.js';
import { BLANK_DESTINATION } from '../const.js';

export default class DestinationsModel {
  #destinations = mockDestinations;

  get destinations() {
    return this.#destinations;
  }

  getDestinationById(id) {
    const allDestinations = this.destinations;
    const destinationById = allDestinations.find((destination) => destination.id === id);

    return destinationById ?? BLANK_DESTINATION;
  }
}
