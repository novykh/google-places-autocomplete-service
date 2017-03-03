import initialize from './config';
import {
  status,
  googleStatus,
  defaultPlaceTypes,
  outputTypes
} from './constants';
import {
  getLatLong,
  getSearchType,
  getPlaceTypes,
  getSearchStrategies,
  getRestrictions,
  emptyResults,
  rejectByRegex,
  findPlaceByType,
  pipeStrategies
} from './helpers';

export default function googlePlaces({...options}) {
  const {
    getGoogleAutocompleteService,
    getGooglePlacesService,
    getGeocoder
  } = initialize();

  const googleAutocompleteService = getGoogleAutocompleteService();
  const googlePlacesService = getGooglePlacesService();
  const geocoder = getGeocoder();

  this.longitude = null;
  this.latitude = null;

  const componentRestrictions = getRestrictions(options);
  const placeTypes = getPlaceTypes(options);
  const filterType = getSearchType(options);
  const searchStrategies = getSearchStrategies(options);

  return {
    getPredictions(input = '', callback = (noop => noop), rejectRegex = null) {
      return new Promise((resolve, reject) => {
        if (!input) {
          reject(status.INVALID_INPUT);
          return;
        }

        if (!(rejectRegex instanceof RegExp)) {
          throw new Error('Pass a valid regex as third argument.');
        }

        googleAutocompleteService.getPlacePredictions({
          input,
          componentRestrictions,
          types: [filterType]
        }, (predictions, responseStatus) => {
          if (responseStatus !== googleStatus.OK) {
            resolve(status.NO_RESULTS);
            callback({});
            return;
          }

          resolve(status.SUCCESS);
          callback(
            rejectByRegex(predictions, rejectRegex)
              .reduceRight((results, p) => {
                return {
                  [p.place_id]: {
                    body: p.description,
                    type: p.types[0],
                    terms: p.terms.map(t => t.value)
                  },
                  ...results
                };
              }, {})
          );
        });
      });
    },

    getPlace(placeId, prediction, callback = (noop => noop)) {
      if (!prediction || typeof prediction !== 'object') {
        prediction = {};
      }

      const {
        type: predictionType,
        terms = [],
        body
      } = prediction;
      const predictionTerms = terms.slice();

      if (placeId === '' || !body) {
        return callback(emptyResults(status.NO_RESULTS));
      }

      let resultComponents = {};

      const getTermIndex = (longName, shortName) => {
        const index = predictionTerms.indexOf(longName);

        return index > -1 ? index : predictionTerms.indexOf(shortName);
      };

      const getAddressComponents = (places = []) => {
        const placeComponents = places.reduce((components, c) => {
          const placeType = c.types
            .find(t => defaultPlaceTypes[t]);
          const type = placeTypes[placeType];

          const termIndex = getTermIndex(c.long_name, c.short_name);
          if (termIndex === -1 && !type) {
            return components;
          }

          let term;
          if (termIndex > -1 && type) {
            term = predictionTerms.splice(termIndex, 1);
          }

          if (
            !placeType
            || (!term && resultComponents[type])
            || (type === placeTypes.postal_code
              && placeTypes[predictionType] === placeTypes.locality)
          ) {
            return components;
          }

          if (type === placeTypes.administrative_area_level_1) {
            return {
              ...components,
              administrativeAreaLevel1Code: c.short_name,
              administrativeAreaLevel1: c.long_name
            };
          }

          return {
            ...components,
            [defaultPlaceTypes[placeType]]: c.long_name
          };
        }, {});

        resultComponents = {
          ...resultComponents,
          ...placeComponents
        };

        return resultComponents;
      };

      const searchByPlaceId = (addressComponents = {}) => {
        return new Promise((resolve, reject) => {
          googlePlacesService.getDetails({
            placeId
          }, (place, responseStatus) => {

            if (responseStatus !== googleStatus.OK) {
              reject(responseStatus);
              return;
            }

            this.longitude = place.geometry.location.lng();
            this.latitude = place.geometry.location.lat();

            resolve({
              ...addressComponents,
              ...getAddressComponents(place.address_components)
            });
          });
        });
      };

      const searchByText = (addressComponents = {}) => {
        return new Promise((resolve, reject) => {
          googlePlacesService.textSearch({
            query: body
          }, (places, responseStatus) => {

            if (responseStatus !== googleStatus.OK) {
              reject(responseStatus);
              return;
            }

            const place = places[0];

            this.longitude = place.geometry.location.lng();
            this.latitude = place.geometry.location.lat();

            resolve({
              ...addressComponents,
              ...getAddressComponents(place.address_components)
            });
          });
        });
      };

      const searchWithGeocoder = (addressComponents = {}) => {
        return new Promise((resolve, reject) => {
          geocoder.geocode({
            latLng: getLatLong(this.latitude, this.longitude)
          }, (results, responseStatus) => {
            if (responseStatus !== googleStatus.OK) {
              reject(responseStatus);
              return;
            }

            if (placeTypes[predictionType]) {
              [
                placeTypes.administrative_area_level_1,
                placeTypes.locality,
                placeTypes.postal_code,
                placeTypes.street_address
              ].some(type => {
                const place = findPlaceByType(results, type, placeTypes);

                addressComponents = {
                  ...addressComponents,
                  ...getAddressComponents(place.address_components)
                };

                return type === placeTypes[predictionType];
              });
            }

            resolve(addressComponents);
            return;
          });
        });
      };

      const outputResult = addressComponents => callback({
        coords: `${this.latitude}, ${this.longitude}`,
        ...addressComponents,
        notValid: predictionTerms,
        status: predictionTerms.length
          ? status.PARTIAL_SUCCESS
          : status.SUCCESS
      });

      const resolveFunc = (func, nextFunc) => {
        return func.then(addressComponents => {
          const hasEmptyValues = (outputTypes[predictionType] || [])
            .some(t => !addressComponents[t]);

          return nextFunc && (predictionTerms.length || hasEmptyValues)
            ? nextFunc(addressComponents)
            : addressComponents;
        });
      };

      try {
        const placeStrategies = {
          searchByPlaceId,
          searchByText,
          searchWithGeocoder
        };

        return pipeStrategies(searchStrategies, placeStrategies, resolveFunc)
          .then(addressComponents => outputResult(addressComponents))
          .catch(error => callback(emptyResults(error)));

      } catch (e) {
        return callback(emptyResults(status.NO_RESULTS));
      }
    }
  };
}
