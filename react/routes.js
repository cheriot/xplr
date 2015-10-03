import React from 'react';
import { Route, DefaultRoute } from 'react-router';
import Root from './components/root';
import FeedManagement from './components/feed_management';

var routes = (
  <Route path="/" handler={Root}>
    <Route path="management" handler={FeedManagement}/>
  </Route>
);

module.exports = routes;
