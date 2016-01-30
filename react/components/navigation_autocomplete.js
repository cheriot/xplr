import React from 'react';
import reactMixin from 'react-mixin';
import { History } from 'react-router';

import PlaceActions from '../actions/place_actions';
import GooglePlacesAutocomplete from './google_places_autocomplete';

@reactMixin.decorate(History)
class NavigationAutocomplete extends React.Component {

  handlePlaceSelect = (gPlace) => {
    PlaceActions
      .createPlace(gPlace)
      .then(place => this.history.pushState(null, `/destinations/${place.id}`) );
  }

  render() {
    return (
      <div className='navigation-autocomplete'>
        <GooglePlacesAutocomplete
            onPlaceSelect={this.handlePlaceSelect}
            isFocus={true}
            placeholder='Where do you want to go?' />
      </div>
    );
  }

}

module.exports = NavigationAutocomplete
