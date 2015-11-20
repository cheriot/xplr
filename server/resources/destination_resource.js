import _ from 'lodash';

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

  static createDestination(place) {
    const placeId = place.get('id');
    const countryId = place.get('country_id');

    let listPromise = null;
    if (place.isCity()) {
      const countryPromise = PlaceResource.fetch(countryId, {withRelated: ['feedEntries']});
      const nearestToPromise = PlaceResource.nearestTo(place);

      listPromise = Promise.all([nearestToPromise, countryPromise])
        .then(([relatedDestinations, countryDestinations]) => {
          return relatedDestinations.models.concat(countryDestinations);
        })
        .then(places => places.map(this.placeToDestination));

    } else if (place.isCountry()) {
      listPromise = PlaceResource.fetchByCountry(countryId)
        .then(places => places.map(this.placeToDestination));
    } else {
      console.log('ERROR: Unknown kind of place.', place);
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
