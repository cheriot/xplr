import {importFeedEntries,summarizeFeedEntries} from '../models/etl/feed_entry_importer';

const exit = () => process.exit();

importFeedEntries()
  .then(() => summarizeFeedEntries())
  .then(exit)
  .catch((err) => {
    console.log(`ERROR: ${err}`);
    throw err;
  });
