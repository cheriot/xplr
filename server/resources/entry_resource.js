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
    return this.fetchById(id)
      .then((feedEntry) => feedEntry.save({published_state: 'ignored'}));
  }

  static publish(req) {
    console.log('publish', req.params.id, req.body);
  }

  static addPlace(req) {
    return Promise.all([
      this.fetchById(req.params.id),
      PlaceResource.updateOrCreate(req.body)
    ]).then(([feedEntry, place]) => {
      feedEntry.places().attach(place.id);
      return feedEntry.refresh(this.fetchOptions());
    });
  }

  static fetchById(id, options) {
    return FeedEntry.forge({id: id}).fetch(options);
  }

  static fetchOptions() {
    // If we're sending records to the client, include relations.
    return {withRelated: ['feed', 'places']};
  }

}

module.exports = EntryResource;
