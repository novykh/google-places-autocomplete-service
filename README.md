# google-places-autocomplete-service
A simple factory using google places API to fetch predictions for places and get place details.

## Installation
`npm i -S google-places-autocomplete-service`

Then add the Google Places API script to your page:

<script src="https://maps.googleapis.com/maps/api/js?libraries=places"></script>

## Usage

First add the dependency to your app:

```
import googlePlacesService from 'google-places-autocomplete-service';
```

Then initialize the service:
```
this.googlePlaces = googlePlacesService(options);
```

Then get predictions:
```
this.googlePlaces.getPredictions('example text', callback);
```

Then get place info:
```
this.googlePlaces.getPlace(predictionObject, callback);
```

And that's it.

## Configuration

The service accepts some options on initialization, for example:
```
this.googlePlaces = googlePlacesService({
  type: 'geocode',
  filterByCountry: 'US',
  outputPlaceTypes: [
    'postalCode',
    'locality',
    'administrativeAreaLevel1',
    'country'
  ],
  searchStrategies: [
    'searchByPlaceId'
  ]
});
```

### The type option:
This option will be used in `getPredictions` to filter predictions results - if none is passed `geocode` will be used as a default.

#### Valid types:
* geocode
* address
* establishment
* (regions)
* (cities)

### The filterByCountry option:
This option will be used in `getPredictions` to restrict the predictions results to a country.
Accepts uppercase ISO Alpha-2 country code - if none is passed then it will output global predictions.

### The outputPlaceTypes option:
This option will be used in `getPlace` to make sure it will return a place with those place info types included.

#### Valid types:
* streetAddress
* route
* streetNumber
* neighborhood
* postalCode
* sublocality
* locality
* administrativeAreaLevel1
* administrativeAreaLevel2
* administrativeAreaLevel3
* administrativeAreaLevel4
* administrativeAreaLevel5
* country

### The searchStrategies option:
This option will be used in `getPlace` and will search for the specified place with the strategies passed - if none is passed then it will use all the strategies needed.

### Extra options:
* `longitude` and `latitude` are optional, but required if use only `searchWithGeocoder` and nothing else.

### `getPredictions(input, callback, regex)`
Retrieves place autocomplete predictions based on the supplied arguments.
`Return value:  None`

- `input`:    string - The user entered input string.
- `callback`: function - What to do with the results i.e: `(predictions) => console.log(predictions)`.
- `regex`:    regexp - (optional) A regex to filter out predictions.

The predictions object passing to the callback, is an object of placeIds as keys and the corresponding info of the prediction. Like that:
```
{
  ChIJOwg_06VPwokRYv534QaPC8g: {
    body: "New York, NY, United States"
    terms: [
      "New York",
      "NY",
      "United States"
    ],
    type: "locality"
  },
  ...
}
```

### `getPlace(prediction, callback)`
Retrieves details about the place.
`Return value: None`

- `prediction`: object - the prediction :)
  - `placeId`:    string - the prediction's place ID.
  - `type`:  string - prediction's first of types.
  - `terms`: array - prediction's string tokens.
  - `body`:  string - prediction's body.
- `callback`: function - What to do with the result i.e: `(placeInfo) => console.log(placeInfo)`.

The placeInfo passing to the callback, is an object with place's info like coords, prediction terms that couldn't find, status and of course all the place types that could find. For example:
```
{
  coords: "40.6781784, -73.9441579",
  sublocality: "Brooklyn",
  locality: "New York",
  administrativeAreaLevel1: "New York",
  administrativeAreaLevel1Code: "NY",
  country: "United States",
  notValid: [],
  status: "SUCCESS"
}
```

## Issues or feature requests

Create a ticket [here](https://github.com/novykh/google-places-autocomplete-service/issues)

## Contributing

Issue a pull request.
