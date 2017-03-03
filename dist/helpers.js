'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rejectByRegex = exports.pipeStrategies = exports.getSearchStrategies = exports.getRestrictions = exports.getPlaceTypes = exports.findPlaceByType = exports.emptyResults = exports.getSearchType = exports.getLatLong = undefined;

var _constants = require('./constants');

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getLatLong = exports.getLatLong = function getLatLong(lat, long) {
  return new global.google.maps.LatLng(lat, long);
};

var getSearchType = exports.getSearchType = function getSearchType(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === undefined ? 'locality' : _ref$type;
  return _constants.validSearchTypes[type] || _constants.validSearchTypes.geocode;
};

var emptyResults = exports.emptyResults = function emptyResults(s) {
  return { status: s };
};

var findPlaceByType = exports.findPlaceByType = function findPlaceByType(data, placeType) {
  var placeTypes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return data.find(function (d) {
    return placeTypes[d.types[0]] === placeType;
  }) || {};
};

var getPlaceTypes = exports.getPlaceTypes = function getPlaceTypes(_ref2) {
  var _ref2$outputPlaceType = _ref2.outputPlaceTypes,
      outputPlaceTypes = _ref2$outputPlaceType === undefined ? [] : _ref2$outputPlaceType;

  return Object.keys(_constants.defaultPlaceTypes).reduce(function (types, type) {
    if (!outputPlaceTypes.includes(_constants.defaultPlaceTypes[type])) {
      return types;
    }

    return Object.assign({}, types, _defineProperty({}, type, _constants.defaultPlaceTypes[type]));
  }, {});
};

var getRestrictions = exports.getRestrictions = function getRestrictions(_ref3) {
  var _ref3$filterByCountry = _ref3.filterByCountry,
      country = _ref3$filterByCountry === undefined ? '' : _ref3$filterByCountry;
  return { country: country };
};

var getSearchStrategies = exports.getSearchStrategies = function getSearchStrategies(_ref4) {
  var searchStrategies = _ref4.searchStrategies;

  if (!searchStrategies) {
    return _constants.validStrategies;
  }

  if (!Array.isArray(searchStrategies)) {
    throw new Error('searchStrategies should be of type array');
  }

  return searchStrategies.filter(function (s) {
    var isValid = _constants.validStrategies.includes(s);

    if (!isValid) {
      console.error(s + ' is not a valid strategy - skipped');

      return false;
    }

    return true;
  });
};

var pipeStrategies = exports.pipeStrategies = function pipeStrategies(selectedStrategies, allStrategies, resolve) {
  var _selectedStrategies = _toArray(selectedStrategies),
      firstFunc = _selectedStrategies[0],
      restFuncs = _selectedStrategies.slice(1);

  if (selectedStrategies.some(function (s) {
    return typeof allStrategies[s] !== 'function';
  })) {
    return {};
  }

  if (!restFuncs.length) {
    return resolve(allStrategies[firstFunc]());
  }

  return restFuncs.reduce(function (pre, func) {
    return resolve(pre, allStrategies[func]);
  }, allStrategies[firstFunc]());
};

var rejectByRegex = exports.rejectByRegex = function rejectByRegex(predictions, regex) {
  if (!regex) {
    return predictions;
  }

  return predictions.filter(function (p) {
    return !regex.test(p.description);
  });
};

exports.default = {
  getLatLong: getLatLong,
  getSearchType: getSearchType,
  getRestrictions: getRestrictions,
  emptyResults: emptyResults,
  findPlaceByType: findPlaceByType,
  getPlaceTypes: getPlaceTypes,
  getSearchStrategies: getSearchStrategies,
  pipeStrategies: pipeStrategies,
  rejectByRegex: rejectByRegex
};