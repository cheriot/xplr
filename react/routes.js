import React from 'react';
import { Route, DefaultRoute } from 'react-router';
import Root from './components/root';
import ManagementRoot from './components/management_root';
import FeedManagement from './components/feed_management';
import FeedManagementEditor from './components/feed_management_editor';
import EntryQueue from './components/entry_queue';

var routes = (
  <Route path="/" handler={Root}>
    <Route path="management" handler={ManagementRoot}>
      <Route path="feeds" handler={FeedManagement}/>
      <Route path="feeds/:id" handler={FeedManagementEditor}/>
      <Route path="queue" handler={EntryQueue}/>
    </Route>
  </Route>
);

module.exports = routes;
