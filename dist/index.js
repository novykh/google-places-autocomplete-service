'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = googlePlaces;

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _constants = require('./constants');

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function googlePlaces(_ref) {
  var options = _objectWithoutProperties(_ref, []);

  var _initialize = (0, _config2.default)(),
      getGoogleAutocompleteService = _initialize.getGoogleAutocompleteService,
      getGooglePlacesService = _initialize.getGooglePlacesService,
      getGeocoder = _initialize.getGeocoder;

  var googleAutocompleteService = getGoogleAutocompleteService();
  var googlePlacesService = getGooglePlacesService();
  var geocoder = getGeocoder();

  this.longitude = null;
  this.latitude = null;

  var componentRestrictions = (0, _helpers.getRestrictions)(options);
  var placeTypes = (0, _helpers.getPlaceTypes)(options);
  var filterType = (0, _helpers.getSearchType)(options);
  var searchStrategies = (0, _helpers.getSearchStrategies)(options);

  return {
    getPredictions: function getPredictions() {
      var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (noop) {
        return noop;
      };
      var rejectRegex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      return new Promise(function (resolve, reject) {
        if (!input) {
          reject(_constants.status.INVALID_INPUT);
          return;
        }

        if (!(rejectRegex instanceof RegExp)) {
          throw new Error('Pass a valid regex as third argument.');
        }

        googleAutocompleteService.getPlacePredictions({
          input: input,
          componentRestrictions: componentRestrictions,
          types: [filterType]
        }, function (predictions, responseStatus) {
          if (responseStatus !== _constants.googleStatus.OK) {
            resolve(_constants.status.NO_RESULTS);
            callback({});
            return;
          }

          resolve(_constants.status.SUCCESS);
          callback((0, _helpers.rejectByRegex)(predictions, rejectRegex).reduceRight(function (results, p) {
            return Object.assign(_defineProperty({}, p.place_id, {
              body: p.description,
              type: p.types[0],
              terms: p.terms.map(function (t) {
                return t.value;
              })
            }), results);
          }, {}));
        });
      });
    },
    getPlace: function getPlace(placeId, prediction) {
      var _this = this;

      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (noop) {
        return noop;
      };

      if (!prediction || (typeof prediction === 'undefined' ? 'undefined' : _typeof(prediction)) !== 'object') {
        prediction = {};
      }

      var _prediction = prediction,
          predictionType = _prediction.type,
          _prediction$terms = _prediction.terms,
          terms = _prediction$terms === undefined ? [] : _prediction$terms,
          body = _prediction.body;

      var predictionTerms = terms.slice();

      if (placeId === '' || !body) {
        return callback((0, _helpers.emptyResults)(_constants.status.NO_RESULTS));
      }

      var resultComponents = {};

      var getTermIndex = function getTermIndex(longName, shortName) {
        var index = predictionTerms.indexOf(longName);

        return index > -1 ? index : predictionTerms.indexOf(shortName);
      };

      var getAddressComponents = function getAddressComponents() {
        var places = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        var placeComponents = places.reduce(function (components, c) {
          var placeType = c.types.find(function (t) {
            return _constants.defaultPlaceTypes[t];
          });
          var type = placeTypes[placeType];

          var termIndex = getTermIndex(c.long_name, c.short_name);
          if (termIndex === -1 && !type) {
            return components;
          }

          var term = void 0;
          if (termIndex > -1 && type) {
            term = predictionTerms.splice(termIndex, 1);
          }

          if (!placeType || !term && resultComponents[type] || type === placeTypes.postal_code && placeTypes[predictionType] === placeTypes.locality) {
            return components;
          }

          if (type === placeTypes.administrative_area_level_1) {
            return Object.assign({}, components, {
              administrativeAreaLevel1Code: c.short_name,
              administrativeAreaLevel1: c.long_name
            });
          }

          return Object.assign({}, components, _defineProperty({}, _constants.defaultPlaceTypes[placeType], c.long_name));
        }, {});

        resultComponents = Object.assign({}, resultComponents, placeComponents);

        return resultComponents;
      };

      var searchByPlaceId = function searchByPlaceId() {
        var addressComponents = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        return new Promise(function (resolve, reject) {
          googlePlacesService.getDetails({
            placeId: placeId
          }, function (place, responseStatus) {

            if (responseStatus !== _constants.googleStatus.OK) {
              reject(responseStatus);
              return;
            }

            _this.longitude = place.geometry.location.lng();
            _this.latitude = place.geometry.location.lat();

            resolve(Object.assign({}, addressComponents, getAddressComponents(place.address_components)));
          });
        });
      };

      var searchByText = function searchByText() {
        var addressComponents = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        return new Promise(function (resolve, reject) {
          googlePlacesService.textSearch({
            query: body
          }, function (places, responseStatus) {

            if (responseStatus !== _constants.googleStatus.OK) {
              reject(responseStatus);
              return;
            }

            var place = places[0];

            _this.longitude = place.geometry.location.lng();
            _this.latitude = place.geometry.location.lat();

            resolve(Object.assign({}, addressComponents, getAddressComponents(place.address_components)));
          });
        });
      };

      var searchWithGeocoder = function searchWithGeocoder() {
        var addressComponents = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        return new Promise(function (resolve, reject) {
          geocoder.geocode({
            latLng: (0, _helpers.getLatLong)(_this.latitude, _this.longitude)
          }, function (results, responseStatus) {
            if (responseStatus !== _constants.googleStatus.OK) {
              reject(responseStatus);
              return;
            }

            if (placeTypes[predictionType]) {
              [placeTypes.administrative_area_level_1, placeTypes.locality, placeTypes.postal_code, placeTypes.street_address].some(function (type) {
                var place = (0, _helpers.findPlaceByType)(results, type, placeTypes);

                addressComponents = Object.assign({}, addressComponents, getAddressComponents(place.address_components));

                return type === placeTypes[predictionType];
              });
            }

            resolve(addressComponents);
            return;
          });
        });
      };

      var outputResult = function outputResult(addressComponents) {
        return callback(Object.assign({
          coords: _this.latitude + ', ' + _this.longitude
        }, addressComponents, {
          notValid: predictionTerms,
          status: predictionTerms.length ? _constants.status.PARTIAL_SUCCESS : _constants.status.SUCCESS
        }));
      };

      var resolveFunc = function resolveFunc(func, nextFunc) {
        return func.then(function (addressComponents) {
          var hasEmptyValues = (_constants.outputTypes[predictionType] || []).some(function (t) {
            return !addressComponents[t];
          });

          return nextFunc && (predictionTerms.length || hasEmptyValues) ? nextFunc(addressComponents) : addressComponents;
        });
      };

      try {
        var placeStrategies = {
          searchByPlaceId: searchByPlaceId,
          searchByText: searchByText,
          searchWithGeocoder: searchWithGeocoder
        };

        return (0, _helpers.pipeStrategies)(searchStrategies, placeStrategies, resolveFunc).then(function (addressComponents) {
          return outputResult(addressComponents);
        }).catch(function (error) {
          return callback((0, _helpers.emptyResults)(error));
        });
      } catch (e) {
        return callback((0, _helpers.emptyResults)(_constants.status.NO_RESULTS));
      }
    }
  };
}