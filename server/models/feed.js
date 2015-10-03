import bookshelf from './bookshelf';
import Checkit from 'checkit';

module.exports = bookshelf.Model.extend({
  tableName: 'feeds',
  hasTimestamps: true,

  initialize: function (attrs, opts) {
    this.on('saving', this.validateSave);
  },

  validateSave: function() {
    return new Checkit({
      name: 'required',
      uri: 'required'
    }).run(this.attributes);
  }
});
