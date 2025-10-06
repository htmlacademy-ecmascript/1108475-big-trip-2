import { POINT_DESTINATIONS, POINT_DESCRIPTIONS } from '../const.js';
import { getRandomArrElem, getRandomInteger } from '../util.js';

const mockDestinations = Array.from({ length: POINT_DESTINATIONS.length }, (_, i) => ({
  id: `${1000 + i}`,
  description: Array.from({ length: getRandomInteger(1, 5) }, () => getRandomArrElem(POINT_DESCRIPTIONS)).join(' '),
  name: getRandomArrElem(POINT_DESTINATIONS),
  pictures: Array.from({ length: getRandomInteger(0, 5) }, (v, n) => ({
    src: `https://placehold.jp/3d4070/ffffff/150x150.png?text=${n + 1}`,
    description: getRandomArrElem(POINT_DESCRIPTIONS),
  }))
}));

export {mockDestinations};
