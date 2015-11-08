import React from 'react/addons';
import BasePortal from './base_portal';
import googleMapPromise from './google_maps';

class GooglePlacesAutocomplete extends BasePortal {

  initExternalDOM(node) {
    googleMapPromise.then((maps) => {
      this.autocomplete = new google.maps.places.Autocomplete(
        this.refs.placesInput.getDOMNode(),
        {}
      );
      this.autocomplete.addListener('place_changed', this.handlePlaceChanged);
    });
  }

  destroyExternalDOM(node) {
    this.autocomplete.unbindAll();
  }

  handlePlaceChanged = () => {
    const googlePlace = this.autocomplete.getPlace();
    console.log('Google Place', googlePlace);
    if (googlePlace) this.props.onPlaceSelect(googlePlace);
    this.refs.placesInput.getDOMNode().value = '';
  }

  handleStopSubmit = (event) => {
    event.preventDefault();
  }

  styles() {
    return {
      width: '300px'
    };
  }

  render() {
    return (
      <form onSubmit={this.handleStopSubmit}>
        <input
            style={this.styles()}
            ref='placesInput'
            type='text' />
      </form>
    );
  }

}

module.exports = GooglePlacesAutocomplete;
