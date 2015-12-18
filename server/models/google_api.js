import _ from 'lodash';
import agent from '../../react/sources/agent';
import config from '../../config';

class GoogleAPI {
  constructor(key) {
    this.key = key;
  }

  placeAutocomplete(name, types) {
    return this.get(
      'https://maps.googleapis.com/maps/api/place/autocomplete/json',
      {input: name, types: types},
      PlaceAutocompleteResponse
    );
  }

  placeDetail(placeId) {
    return this.get(
      'https://maps.googleapis.com/maps/api/place/details/json',
      {placeid: placeId},
      PlaceDetailResponse
    );
  }

  params(more) {
    return _.assign({
      key: this.key,
      language: 'en'
    }, more);
  }

  get(uri, params, ResponseModel) {
    console.log('API', uri, params);
    return agent.get(uri)
      .query(this.params(params))
      .end()
      .then(response => {
        if (response.body.status == 'OK') {
          return new ResponseModel(response);
        } else {
          throw new Error(response.body);
        }
      })
      .catch(response => console.log('http error', response));
  }
}

class BaseResponse {
  constructor(content) {
    _.assign(this, content);
  }
}

class PlaceAutocompleteResponse extends BaseResponse {
  constructor(response) {
    super(response.body);
  }
}

class PlaceDetailResponse extends BaseResponse {
  // move lat/long and viewport values around
  // like in place source
  constructor(response) {
    super(response.body.result);
    this.lat = this.geometry.location.lat;
    this.lon = this.geometry.location.lng;
    if (this.geometry.viewport) {
      this.viewport_lat_north = this.geometry.viewport.northeast.lat;
      this.viewport_lat_south = this.geometry.viewport.southwest.lat;
      this.viewport_lon_east = this.geometry.viewport.northeast.lng;
      this.viewport_lon_west = this.geometry.viewport.southwest.lng;
    }
  }
}

module.exports = new GoogleAPI(config.googleKeyServer);
