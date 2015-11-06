import React from 'react/addons';
import BasePortal from './base_portal';
import googleMapPromise from './google_maps';

class GooglePlacesAutocomplete extends BasePortal {

  initExternalDOM(node) {
    // Add input that will become the autocomplete
    this.input = document.createElement('input');
    this.input.setAttribute('type', 'text');
    node.appendChild(this.input);

    googleMapPromise.then((maps) => {
      this.autocomplete = new google.maps.places.Autocomplete(
        this.input,
        {}
      );
      this.autocomplete.addListener('place_changed', this.onPlaceChanged.bind(this));
    });
  }

  destroyExternalDOM(node) {
    this.autocomplete.unbindAll();
    node.removeChild(this.input);
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
