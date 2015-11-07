import React from 'react/addons';
import BasePortal from './base_portal';
import googleMapPromise from './google_maps';

class GooglePlacesAutocomplete extends BasePortal {

  initExternalDOM(node) {
    googleMapPromise.then((maps) => {
      this.autocomplete = new google.maps.places.Autocomplete(
        React.findDOMNode(this),
        {}
      );
      this.autocomplete.addListener('place_changed', this.onPlaceChanged.bind(this));
    });
  }

  destroyExternalDOM(node) {
    this.autocomplete.unbindAll();
  }

  onPlaceChanged() {
    const googlePlace = this.autocomplete.getPlace();
    if (googlePlace) this.props.onPlaceSelect(googlePlace);
  }

  styles() {
    return {
      width: '300px'
    };
  }

  render() {
    return <input
      style={this.styles()}
      ref='placesInput'
      type='text' />
  }

}

module.exports = GooglePlacesAutocomplete;
