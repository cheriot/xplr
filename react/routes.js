import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Root from './components/root';
import Home from './components/home';
import DestinationHome from './components/destination_home';

import ManagementRoot from './components/management_root';
import FeedManagement from './components/feed_management';
import FeedManagementEditor from './components/feed_management_editor';
import EntryQueue from './components/entry_queue';

var routes = (
  <Route path="/" component={Root}>
    <IndexRoute component={Home} />
    <Route path="destinations/:id" component={DestinationHome} />

    <Route path="management" component={ManagementRoot}>
      <Route path="feeds" component={FeedManagement} />
      <Route path="feeds/:id" component={FeedManagementEditor} />
      <Route path="queue" component={EntryQueue} />
    </Route>
  </Route>
);

module.exports = routes;
