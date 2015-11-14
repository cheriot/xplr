import PlaceResource from './place_resource';
import EntryResource from './entry_resource';

class DestinationResource {

  static fetch(bounds) {
    console.log('fetch box', bounds);
    return PlaceResource.nearBy(bounds)
      .then(places => {
        return {nearByDestinations: places};
      });
  }

  static fetchByPlace(placeId) {
    const destinationPromise = PlaceResource
      .fetch(placeId)
      .then(this.createDestination);

    return Promise.all([
      destinationPromise,
      EntryResource.fetchByPlace(placeId)
    ]).then( ([destination, feedEntries]) => {
      destination.feedEntries = feedEntries;
      return destination;
    });
  }

  static createDestination(place) {
    return PlaceResource
      .nearByPlace(place)
      .then(places => {
        return {
          place: place,
          nearByDestinations: places,
        };
      });
  }

}

module.exports = DestinationResource
