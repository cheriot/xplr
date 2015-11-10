import React from 'react';
import { Route, DefaultRoute } from 'react-router';

import Root from './components/root';
import Home from './components/home';
import DestinationHome from './components/destination_home';

import ManagementRoot from './components/management_root';
import FeedManagement from './components/feed_management';
import FeedManagementEditor from './components/feed_management_editor';
import EntryQueue from './components/entry_queue';

var routes = (
  <Route path="/" handler={Root}>
    <DefaultRoute handler={Home} />
    <Route path="destinations/:id" handler={DestinationHome} />

    <Route path="management" handler={ManagementRoot}>
      <Route path="feeds" handler={FeedManagement} />
      <Route path="feeds/:id" handler={FeedManagementEditor} />
      <Route path="queue" handler={EntryQueue} />
    </Route>
  </Route>
);

module.exports = routes;
