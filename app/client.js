// Connect this file to browserfy
import React from 'react/addons';
import Root from './components/root';

var mountNode = document.getElementById("react-main-mount");

React.render(<Root />, mountNode);
