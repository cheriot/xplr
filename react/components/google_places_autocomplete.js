import React from 'react/addons';
import BasePortal from './base_portal';
import googleMapPromise from '../models/google_maps';

class GooglePlacesAutocomplete extends BasePortal {

  initExternalDOM(node) {
    googleMapPromise.then((maps) => {
      const opts = {types: this.props.placeTypes || []};

      this.autocomplete = new google.maps.places.Autocomplete(
        this.refs.placesInput.getDOMNode(),
        opts
      );
      this.autocomplete.addListener('place_changed', this.handlePlaceChanged);
    });

    if (this.props.isFocus) {
      this.refs.placesInput.getDOMNode().focus();
    }
  }

  updateExternalDOM(node, newProps) {
    if (newProps.isFocus) {
      this.refs.placesInput.getDOMNode().focus();
    }
  }

  destroyExternalDOM(node) {
    this.autocomplete.unbindAll();
  }

  handlePlaceChanged = () => {
    const googlePlace = this.autocomplete.getPlace();
    console.log('Google Place', googlePlace.types, googlePlace);
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
    const placeholder = this.props.placeholder || 'Enter a location';
    return (
      <form onSubmit={this.handleStopSubmit}>
        <input
            style={this.styles()}
            ref='placesInput'
            placeholder={placeholder}
            type='text' />
      </form>
    );
  }

}

module.exports = GooglePlacesAutocomplete;
