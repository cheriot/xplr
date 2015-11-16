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
    return PlaceResource
      .fetch(placeId)
      .then(this.createDestination);
  }

  static createDestination(place) {
    const placeId = place.get('id');
    const countryId = place.get('country_id');
    const promises = [
      EntryResource.fetchByPlace(placeId),
      PlaceResource.nearByPlace(place),
    ];
    if (placeId != countryId) {
      // For countries these are the same queries as above.
      promises.push(
        PlaceResource.fetch(countryId),
        EntryResource.fetchByPlace(countryId)
      );
    }
    return Promise.all(promises)
      .then(([feedEntries, places, country, countryFeedEntries]) => {
        return {
          place: place,
          feedEntries: feedEntries,
          nearByDestinations: places,
          country: country,
          countryFeedEntries: countryFeedEntries
        };
      });
  }

}

module.exports = DestinationResource
