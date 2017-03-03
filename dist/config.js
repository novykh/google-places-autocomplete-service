'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = init;
function init(_ref) {
  var mapId = _ref.mapId;

  if (!global.google || !global.google.maps) {
    throw new Error('Please import google maps');
  }

  if (!/3\.\d\d\.\d+/.test(global.google.maps.version)) {
    throw new Error('Please import a google maps version 3+');
  }

  return {
    getGoogleAutocompleteService: function getGoogleAutocompleteService() {
      return new global.google.maps.places.AutocompleteService();
    },
    getGooglePlacesService: function getGooglePlacesService() {
      if (mapId && typeof mapId !== 'string') {
        throw new Error('MapId is invalid');
      }

      var map = void 0;
      if (mapId) {
        map = document.getElementById(mapId);

        if (!map) {
          throw new Error('Couldn\'t find map in document');
        }
      }

      return new global.google.maps.places.PlacesService(map || document.createElement('div'));
    },
    getGeocoder: function getGeocoder() {
      return new global.google.maps.Geocoder();
    }
  };
}