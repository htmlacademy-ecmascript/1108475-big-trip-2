import { POINT_TYPES, POINT_OFFERS } from '../const.js';
import { getRandomInteger } from '../util.js';


const mockOffers = Array.from({ length: POINT_TYPES.length }, (_, i) => ({
  type: POINT_TYPES[i],
  offers: Array.from({ length: getRandomInteger(0, POINT_OFFERS.length) }, (v, n) => ({
    id: `${100 * (i + 1) + n}`,
    title: POINT_OFFERS[n],
    price: getRandomInteger(5, 500),
  }))
}));

export {mockOffers};

