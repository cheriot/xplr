import React from 'react';
import { Route, DefaultRoute } from 'react-router';
import Root from './components/root';
import FeedManagement from './components/feed_management';
import FeedManagementEditor from './components/feed_management_editor';

var routes = (
  <Route path="/" handler={Root}>
    <Route path="management" handler={FeedManagement}/>
    <Route path="management/feeds/:id" handler={FeedManagementEditor}/>
  </Route>
);

module.exports = routes;
