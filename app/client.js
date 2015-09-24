// Connect this file to browserfy
var React = require('react/addons');
var ComponentRoot = require('./components/root');

var mountNode = document.getElementById("react-main-mount");

React.render(new ComponentRoot({}), mountNode);
