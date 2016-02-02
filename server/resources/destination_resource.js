import _ from 'lodash';

import geoCalc from '../../react/models/geo_calc';
import PlaceResource from './place_resource';
import EntryResource from './entry_resource';

class DestinationResource {

  static fetch(bounds) {
    return PlaceResource.boundedBy(bounds)
      .then(places => {
        return {markerPlaces: places};
      });
  }

  static fetchByPlace(placeId) {
    return PlaceResource
      .fetch(placeId)
      .then(this.createDestination.bind(this));
  }

  static nearestTo(place) {
    return PlaceResource.nearestTo(place)
      .then(collection => collection.models)
      .then(places => geoCalc.orderByDistance(place, places));
  }

  static createDestination(place) {
    const placeId = place.get('id');
    const countryId = place.get('country_id');

    let listPromise = null;
    if (place.isCity()) {
      console.log('isCity', place.get('name'));
      const countryPromise = PlaceResource.fetch(countryId, {withRelated: ['feedEntries']});
      const nearestToPromise = this.nearestTo(place);

      listPromise = Promise.all([nearestToPromise, countryPromise])
        .then(([relatedDestinations, countryDestinations]) => {
          return relatedDestinations.concat(countryDestinations);
        })
        .then(places => places.map(this.placeToDestination));

    } else if (place.isCountry()) {
      console.log('isCountry');
      listPromise = PlaceResource.fetchByCountry(countryId)
        .then(places => places.map(this.placeToDestination));
      // nearby countries? or nearby cities?
    } else {
      console.log(
        'WARN: Unknown kind of place.',
        place.get('id'),
        place.get('name'),
        place.get('google_uri')
      );
      // Some places have no country. Mont Blanc, Lake Titicaca, NE Indian towns
      listPromise = this.nearestTo(place)
        .then(places => places.map(this.placeToDestination));
    }

    const promises = [
      EntryResource.fetchByPlace(placeId),
      listPromise,
    ];

    return Promise.all(promises)
      .then(([feedEntries, listDestinations]) => {
        return {
          place: place || null,
          feedEntries: feedEntries || [],
          listDestinations: listDestinations || [],
        };
      });
  }

  static placeToDestination(place) {
    const feedEntries = place.related('feedEntries').models;
    delete place.relations.feedEntries;
    return {
      place: place,
      feedEntries: feedEntries
    }
  }

}

module.exports = DestinationResource
