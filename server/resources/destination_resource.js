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
    console.log('fetchByPlace start');
    return Promise.all([
      PlaceResource.fetch(placeId),
      EntryResource.fetchByPlace(placeId)
    ]).then( ([place, feedEntries]) => {
      return {
        destinationPlace: place,
        feed_entries: feedEntries
      };
    });
    console.log('fetchByPlace end');
    // fetch place
    //
    // return {
    //   destinationPlace: {}
    //   places: [],
    //   feed_entries: []
    // }
  }

}

module.exports = DestinationResource
