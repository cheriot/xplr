import React from 'react';
import { Router, Route, DefaultRoute } from 'react-router';
import Root from './components/root';

var routes = (
  <Route path="/" handler={Root}/>
);

module.exports = routes;
