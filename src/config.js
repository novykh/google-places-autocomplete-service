export default function init() {
  if (!global.google || !global.google.maps) {
    throw new Error('Please import google maps');
  }

  if (!(/3\.\d\d\.\d+/).test(global.google.maps.version)) {
    throw new Error('Please import a google maps version 3+');
  }

  return {
    getGoogleAutocompleteService: () => {
      return new global.google.maps.places
        .AutocompleteService();
    },
    getGooglePlacesService: mapId => {
      if (mapId && typeof mapId !== 'string') {
        throw new Error('MapId is invalid');
      }

      let map;
      if (mapId) {
        map = document.getElementById(mapId)

        !map && throw new Error('Couldn\'t find map in document');
      }

      return new global.google.maps.places
        .PlacesService(map || document.createElement('div'));
    },
    getGeocoder: () => new global.google.maps.Geocoder()
  };
}
