import agent from '../agent';

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

  selectPlace(feedEntry, googlePlace) {
    // pull lat/lon out of functions so they're serialized
    googlePlace.lat = googlePlace.geometry.location.lat();
    googlePlace.lon = googlePlace.geometry.location.lng();
    return agent.post(`/entries/${feedEntry.id}/places`, googlePlace).then(this.returnBody);
  }

  returnBody(response) {
    return response.body;
  }
}

module.exports = new FeedEntrySource();
