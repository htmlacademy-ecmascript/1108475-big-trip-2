import { getRandomPoint } from '../mock/points.js';
import { mockOffers } from '../mock/offers.js';
import { mockDestinations } from '../mock/destinations.js';

const POINT_COUNT = 4;

export default class PointsModel {
  points = Array.from({ length: POINT_COUNT }, getRandomPoint);
  offers = mockOffers;
  destinations = mockDestinations;

  getPoints() {
    return this.points;
  }

  getOffers() {
    return this.offers;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffersByType(type) {
    const allOffers = this.getOffers();

    return allOffers.find((offer) => offer.type === type);
  }

  getOffersById(type, offersIds) {
    const offersByType = this.getOffersByType(type);

    return offersByType.offers.filter((offer) => offersIds.find((id) => offer.id === id));
  }

  getDestinationById(id) {
    const allDestinations = this.getDestinations();

    return allDestinations.find((destination) => destination.id === id);
  }
}
