import React from 'react/addons';
import BasePortal from './base_portal';
import googleMapPromise from './google_maps';

class GooglePlacesAutocomplete extends React.Component {

  componentDidMount() {
    // Add input that will become the autocomplete
    this.input = document.createElement('input');
    this.input.setAttribute('type', 'text');
    React.findDOMNode(this).appendChild(this.input);

    googleMapPromise.then((maps) => {
      this.autocomplete = new google.maps.places.Autocomplete(
        this.input,
        {}
      );
      this.autocomplete.addListener('place_changed', this.onPlaceChanged.bind(this));
      console.log('autocomplete', this.autocomplete);
      // instantiate autocomplete
    });
  }

  componentWillUnmount() {
    // destroy autocomplete
    this.autocomplete.unbindAll();
    React.findDOMNode(this).removeChild(this.input);
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
