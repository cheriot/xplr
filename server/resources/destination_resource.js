import PlaceResource from './place_resource';
import EntryResource from './entry_resource';

class DestinationResource {

  static fetch(box) {
    const { nw, ne, se, sw } = box;
    // query places with those bounds (cities only - for map markers)
    // query for feed entries with a place within those bounds
    // return {
    //   places: [],
    //   feed_entries: []
    // }
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
      .nearBy(place)
      .then(places => {
        return {
          place: place,
          nearByDestinations: places,
        };
      });
  }

}

module.exports = DestinationResource
