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
    const place = this.autocomplete.getPlace();
    console.log('place changed', place);
  }

  render() {
    return <div/>
    return <input
      ref='placesInput'
      type='text' />
  }

}

module.exports = GooglePlacesAutocomplete;
