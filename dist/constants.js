'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var googleStatus = exports.googleStatus = {};
var _google$maps$places$P = google.maps.places.PlacesServiceStatus;
googleStatus.ERROR = _google$maps$places$P.ERROR;
googleStatus.INVALID_REQUEST = _google$maps$places$P.INVALID_REQUEST;
googleStatus.OK = _google$maps$places$P.OK;
googleStatus.OVER_QUERY_LIMIT = _google$maps$places$P.OVER_QUERY_LIMIT;
googleStatus.REQUEST_DENIED = _google$maps$places$P.REQUEST_DENIED;
googleStatus.UNKNOWN_ERROR = _google$maps$places$P.UNKNOWN_ERROR;
googleStatus.ZERO_RESULTS = _google$maps$places$P.ZERO_RESULTS;
var status = exports.status = {
  INVALID_INPUT: 'INVALID_INPUT',
  NO_RESULTS: 'NO_RESULTS',
  SUCCESS: 'SUCCESS',
  PARTIAL_SUCCESS: 'PARTIAL_SUCCESS'
};

var defaultPlaceTypes = exports.defaultPlaceTypes = {
  street_address: 'streetAddress',
  route: 'route',
  street_number: 'streetNumber',
  neighborhood: 'neighborhood',
  postal_code: 'postalCode',
  sublocality: 'sublocality',
  locality: 'locality',
  administrative_area_level_1: 'administrativeAreaLevel1',
  administrative_area_level_2: 'administrativeAreaLevel2',
  administrative_area_level_3: 'administrativeAreaLevel3',
  administrative_area_level_4: 'administrativeAreaLevel4',
  administrative_area_level_5: 'administrativeAreaLevel5',
  country: 'country'
};

var validSearchTypes = exports.validSearchTypes = {
  geocode: 'geocode',
  address: 'address',
  establishment: 'establishment',
  '(regions)': '(regions)',
  '(cities)': '(cities)'
};

var validStrategies = exports.validStrategies = ['searchByPlaceId', 'searchByText', 'searchWithGeocoder'];

var outputTypes = exports.outputTypes = {
  street_address: [defaultPlaceTypes.streetAddress, defaultPlaceTypes.route, defaultPlaceTypes.streetNumber, defaultPlaceTypes.neighborhood, defaultPlaceTypes.postalCode, defaultPlaceTypes.sublocality, defaultPlaceTypes.locality, defaultPlaceTypes.administrativeAreaLevel1, defaultPlaceTypes.administrativeAreaLevel2, defaultPlaceTypes.administrativeAreaLevel3, defaultPlaceTypes.administrativeAreaLevel4, defaultPlaceTypes.administrativeAreaLevel5, defaultPlaceTypes.country],
  postal_code: [defaultPlaceTypes.postalCode, defaultPlaceTypes.sublocality, defaultPlaceTypes.locality, defaultPlaceTypes.administrativeAreaLevel1, defaultPlaceTypes.administrativeAreaLevel2, defaultPlaceTypes.administrativeAreaLevel3, defaultPlaceTypes.administrativeAreaLevel4, defaultPlaceTypes.administrativeAreaLevel5, defaultPlaceTypes.country],
  locality: [defaultPlaceTypes.locality, defaultPlaceTypes.administrativeAreaLevel1, defaultPlaceTypes.administrativeAreaLevel2, defaultPlaceTypes.administrativeAreaLevel3, defaultPlaceTypes.administrativeAreaLevel4, defaultPlaceTypes.administrativeAreaLevel5, defaultPlaceTypes.country],
  administrative_area_level_1: [defaultPlaceTypes.administrativeAreaLevel1, defaultPlaceTypes.country]
};