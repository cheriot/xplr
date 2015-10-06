import bookshelf from './bookshelf';
import Checkit from 'checkit';

const Feed = bookshelf.Model.extend({
  tableName: 'feeds',
  hasTimestamps: true,

  initialize: function (attrs, opts) {
    this.on('saving', this.validateSave);
  },

  validateSave: function() {
    return new Checkit({
      uri: 'required'
    }).run(this.attributes);
  },

  updateOrInitializeFromRemote: function(feedMeta) {
    this.set('title', feedMeta.title);
    this.set('subtitle', feedMeta.description);
    this.set('source_updated_at', feedMeta.date);
    this.set('source_published_at', feedMeta.pubdate);
    this.set('site_uri', feedMeta.link);
    this.set('author', feedMeta.author);
  },

});


module.exports = Feed;
