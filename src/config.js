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
    getGooglePlacesService: () => {
      return new global.google.maps.places
        .PlacesService(document.createElement('div'));
    },
    getGeocoder: () => new global.google.maps.Geocoder()
  };
}
