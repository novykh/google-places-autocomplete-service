import {
  defaultPlaceTypes,
  validSearchTypes,
  validStrategies
} from './constants';

export const getLatLong = (lat, long) => new global.google.maps.LatLng(lat, long);

export const getSearchType = ({type = 'locality'}) => validSearchTypes[type] || validSearchTypes.geocode;

export const emptyResults = s => ({status: s});

export const findPlaceByType = (data, placeType, placeTypes = {}) => data.find(d => {
  return placeTypes[d.types[0]] === placeType;
}) || {};

export const getPlaceTypes = ({outputPlaceTypes = []}) => {
  return Object.keys(defaultPlaceTypes).reduce((types, type) => {
    if (!outputPlaceTypes.includes(defaultPlaceTypes[type])) {
      return types;
    }

    return {
      ...types,
      [type]: defaultPlaceTypes[type]
    };
  }, {});
};

export const getRestrictions = ({filterByCountry: country = null}) => {
  return country ? {country} : null;
};

export const getSearchStrategies = ({searchStrategies}) => {
  if (!searchStrategies) {
    return validStrategies;
  }

  if (!Array.isArray(searchStrategies)) {
    throw new Error('searchStrategies should be of type array');
  }

  return searchStrategies.filter(s => {
    const isValid = validStrategies.includes(s);

    if (!isValid) {
      throw new Error(`${s} is not a valid strategy`);
      return false;
    }

    return true;
  });
};

export const pipeStrategies = (selectedStrategies, allStrategies, resolve) => {
  const [firstFunc, ...restFuncs] = selectedStrategies;

  if (selectedStrategies.some(s => typeof allStrategies[s] !== 'function')) {
    return {};
  }

  if (!restFuncs.length) {
    return resolve(allStrategies[firstFunc]());
  }

  return restFuncs.reduce((pre, func) => {
    return resolve(pre, allStrategies[func]);
  }, allStrategies[firstFunc]());
};

export const rejectByRegex = (predictions, regex) => {
  if (!regex) {
    return predictions;
  }

  return predictions
    .filter(p => !regex.test(p.description));
};

export default {
  getLatLong,
  getSearchType,
  getRestrictions,
  emptyResults,
  findPlaceByType,
  getPlaceTypes,
  getSearchStrategies,
  pipeStrategies,
  rejectByRegex
};
