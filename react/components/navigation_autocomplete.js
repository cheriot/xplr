import React from 'react/addons';
import reactMixin from 'react-mixin';
import { Navigation } from 'react-router';

import PlaceActions from '../actions/place_actions';
import GooglePlacesAutocomplete from './google_places_autocomplete';

@reactMixin.decorate(Navigation)
class NavigationAutocomplete extends React.Component {

  handlePlaceSelect = (gPlace) => {
    PlaceActions
      .createPlace(gPlace)
      .then(place => this.transitionTo(`/destination/${place.id}`) );
  }

  render() {
    return (
      <GooglePlacesAutocomplete
          onPlaceSelect={this.handlePlaceSelect}
          isFocus={true}
          placeholder='Where do you want to go?'
          placeTypes={['(regions)']} />
    );
  }

}

module.exports = NavigationAutocomplete
