import Checkit from 'checkit';

import bookshelf from './bookshelf';
import FeedEntry from './feed_entry';

const Place = bookshelf.Model.extend({
  tableName: 'places',
  hasTimestamps: true,

  initialize: function (attrs, opts) {
    //this.on('saving', this.validate);
  },

  feedEntities: function() {
    return this.belongsToMany(FeedEntry);
  },

  validate: function() {
    return new Checkit({
      geo_level: (val) => ['country', 'city', 'address'].indexOf(val) > -1
    }).run(this.attributes);
  },

  updateFromGooglePlace: function(googlePlace) {
    this.set({
      name: googlePlace.name,
      google_place_id: googlePlace.id,
      google_uri: googlePlace.url,
      formatted_address: googlePlace.formatted_address,
      lat: googlePlace.lat,
      lon: googlePlace.lon,
      website: googlePlace.website
    });

    this.updateGeoLevel(googlePlace);
  },

  updateGeoLevel(googlePlace) {
    const setGeoLevelIfType = (geoLevel, type) => {
      if (googlePlace.types.indexOf(type) > -1) {
        this.set('geo_level', geoLevel);
      }
    }

    this.set('geo_level', 'address');
    setGeoLevelIfType('country', 'country');
    setGeoLevelIfType('city', 'locality');
  },
});

module.exports = Place
