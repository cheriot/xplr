import {importFeedEntries} from '../models/etl/feed_entry_importer';

const exit = () => process.exit();

importFeedEntries()
  .then(exit, exit);
