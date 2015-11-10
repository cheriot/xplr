import agent from './agent';

import PlaceSource from './place_source';

class FeedEntrySource {
  fetch() {
    return agent.get('/entries').then((response) => {
      return response.body;
    });
  }

  ignore(feedEntry) {
    return agent.post(`/entries/${feedEntry.id}/ignore`).then(this.returnBody);
  }

  publish(feedEntry) {
    return agent.post(`/entries/${feedEntry.id}/publish`).then(this.returnBody);
  }

  selectPlace(feedEntry, gPlace) {
    // pull lat/lon out of functions so they're serialized
    return PlaceSource
      .create(gPlace)
      .then(place => {
        return agent.post(`/entries/${feedEntry.id}/places/${place.id}`)
      })
      .then(this.returnBody);
  }

  removePlace(feedEntry, place) {
    return agent.del(`/entries/${feedEntry.id}/places/${place.id}`).then(this.returnBody);
  }

  returnBody(response) {
    return response.body;
  }
}

module.exports = new FeedEntrySource()
