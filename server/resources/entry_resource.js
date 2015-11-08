import FeedEntry from '../models/feed_entry';
import PlaceResource from './place_resource';

class EntryResource {

  static list(req) {
    // Oldest 10 in the queue
    return FeedEntry
      .where({published_state: 'queued'})
      .query('limit', 30)
      .query('orderBy', 'created_at', 'asc')
      .fetchAll(this.fetchOptions())
      .then((feedEntryCollection) => {
        return feedEntryCollection.models;
      });
  }

  static ignore(req) {
    const id = req.params.id;
    // Query for the full record so validations can be checked.
    return this.forge(id)
      .fetch()
      .then((feedEntry) => feedEntry.save({published_state: 'ignored'}));
  }

  static publish(req) {
    console.log('publish', req.params.id, req.body);
  }

  static addPlace(feedEntryId, googlePlace) {
    return Promise.all([
      this.fetch(feedEntryId),
      PlaceResource.updateOrCreate(googlePlace)
    ]).then(([feedEntry, place]) => {
      feedEntry.places().attach(place.id);
      return feedEntry.refresh(this.fetchOptions());
    });
  }

  static removePlace(feedEntryId, placeId) {
    return this.forge(feedEntryId)
      .places()
      .detach(placeId)
      .then(() => {
        return this.fetch(feedEntryId);
      });
  }

  static forge(id) {
    return FeedEntry.forge({id: id});
  }

  static fetch(id) {
    return this.forge(id).refresh(this.fetchOptions());
  }

  static fetchOptions() {
    // If we're sending records to the client, include relations.
    return {withRelated: ['feed', 'places']};
  }

  static updateOrCreate(feed, remoteEntry) {
    const identity = {feed_id: feed.id, source_id: remoteEntry.guid};
    return FeedEntry
      .forge(identity)
      .fetch()
      .then((feedEntry) => {
        if(!feedEntry) feedEntry = FeedEntry.forge(identity);
        feedEntry.updateFromRemote(remoteEntry);
        return feedEntry.save();
      });
  }

}

module.exports = EntryResource;
