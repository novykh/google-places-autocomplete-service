export const googleStatus = {};
({
  ERROR: googleStatus.ERROR,
  // There was a problem contacting the Google servers.
  INVALID_REQUEST: googleStatus.INVALID_REQUEST,
  // This GeocoderRequest was invalid.
  OK: googleStatus.OK,
  // The response contains a valid GeocoderResponse.
  OVER_QUERY_LIMIT: googleStatus.OVER_QUERY_LIMIT,
  // The webpage has gone over the requests limit in too short a period of time.
  REQUEST_DENIED: googleStatus.REQUEST_DENIED,
  // The webpage is not allowed to use the geocoder.
  UNKNOWN_ERROR: googleStatus.UNKNOWN_ERROR,
  // A geocoding request could not be processed due to a server error. The request may succeed if you try again.
  ZERO_RESULTS: googleStatus.ZERO_RESULTS
  // No result was found for this GeocoderRequest.
} = google.maps.places.PlacesServiceStatus);

export const status = {
  INVALID_INPUT: 'INVALID_INPUT',
  NO_RESULTS: 'NO_RESULTS',
  SUCCESS: 'SUCCESS',
  PARTIAL_SUCCESS: 'PARTIAL_SUCCESS'
};

export const defaultPlaceTypes = {
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

export const validSearchTypes = {
  geocode: 'geocode',
  address: 'address',
  establishment: 'establishment',
  '(regions)': '(regions)',
  '(cities)': '(cities)'
};

export const validStrategies = [
  'searchByPlaceId',
  'searchByText',
  'searchWithGeocoder'
];

export const outputTypes = {
  street_address: [
    defaultPlaceTypes.streetAddress,
    defaultPlaceTypes.route,
    defaultPlaceTypes.streetNumber,
    defaultPlaceTypes.neighborhood,
    defaultPlaceTypes.postalCode,
    defaultPlaceTypes.sublocality,
    defaultPlaceTypes.locality,
    defaultPlaceTypes.administrativeAreaLevel1,
    defaultPlaceTypes.administrativeAreaLevel2,
    defaultPlaceTypes.administrativeAreaLevel3,
    defaultPlaceTypes.administrativeAreaLevel4,
    defaultPlaceTypes.administrativeAreaLevel5,
    defaultPlaceTypes.country
  ],
  postal_code: [
    defaultPlaceTypes.postalCode,
    defaultPlaceTypes.sublocality,
    defaultPlaceTypes.locality,
    defaultPlaceTypes.administrativeAreaLevel1,
    defaultPlaceTypes.administrativeAreaLevel2,
    defaultPlaceTypes.administrativeAreaLevel3,
    defaultPlaceTypes.administrativeAreaLevel4,
    defaultPlaceTypes.administrativeAreaLevel5,
    defaultPlaceTypes.country
  ],
  locality: [
    defaultPlaceTypes.locality,
    defaultPlaceTypes.administrativeAreaLevel1,
    defaultPlaceTypes.administrativeAreaLevel2,
    defaultPlaceTypes.administrativeAreaLevel3,
    defaultPlaceTypes.administrativeAreaLevel4,
    defaultPlaceTypes.administrativeAreaLevel5,
    defaultPlaceTypes.country
  ],
  administrative_area_level_1: [
    defaultPlaceTypes.administrativeAreaLevel1,
    defaultPlaceTypes.country
  ]
};
