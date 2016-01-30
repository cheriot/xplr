import React from 'react';
import BasePortal from './base_portal';
import googleMapPromise from '../models/google_maps';

class GooglePlacesAutocomplete extends BasePortal {

  initExternalDOM(node) {
    googleMapPromise.then((maps) => {

      this.autocomplete = new google.maps.places.Autocomplete(
        this.refs.placesInput,
        this.autocompleteOptions()
      );
      this.autocomplete.addListener('place_changed', this.handlePlaceChanged);
    });

    if (this.props.isFocus) {
      this.refs.placesInput.focus();
    }
  }

  autocompleteOptions() {
    return {types: this.props.placeTypes || []};
  }

  updateExternalDOM(node, newProps) {
    if (newProps.isFocus) {
      this.refs.placesInput.focus();
    }
  }

  destroyExternalDOM(node) {
    this.autocomplete.unbindAll();
  }

  handlePlaceChanged = () => {
    let gPlace = this.autocomplete.getPlace();

    if (gPlace.id) {
      // The user selected one of the autocomplete suggestions.
      this.selectPlace(gPlace);
    } else if (!gPlace.id && gPlace.name) {
      // place_changed will fire when the user has pressed enter without
      // selecting anything from the autocomplete. We need to take that string,
      // make the autocomplete call ourselves and call again for details on
      // the first autocomplete result.
      const options = _.assign(
        this.autocompleteOptions(),
        {input: gPlace.name, offset: gPlace.name.length}
      )

      const handlePlacePredictionResponse = (predictions, status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          new google.maps.places.PlacesService(this.refs.attribution)
            .getDetails(
              {placeId: predictions[0].place_id},
              handlePlaceDetailResponse
            );
        } else {
          console.log('unexpected place prediction response', status, predictions, options);
        }
      }

      const handlePlaceDetailResponse = (gPlace, status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          this.selectPlace(gPlace);
        } else {
          console.log('unexpected place prediction response', status, gPlace);
        }
      }

      new google.maps.places.AutocompleteService()
        .getPlacePredictions(options, handlePlacePredictionResponse);
    }
  }

  selectPlace(gPlace) {
    console.log('Google Place', gPlace.types, gPlace);
    window.gPlace = gPlace; // debugging
    this.props.onPlaceSelect(gPlace);
    this.refs.placesInput.value = '';
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
        <div ref='attribution' style={{hidden: true}} />
      </form>
    );
  }

}

module.exports = GooglePlacesAutocomplete;
