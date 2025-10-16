import {FiltersMap} from '../util.js';

const generateFilters = (points) =>
  [...FiltersMap].map(([filterType, filter]) => ({
    type: filterType,
    pointsCount: filter.filterPoints(points).length
  }));

export {generateFilters};
