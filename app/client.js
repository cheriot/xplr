// Connect this file to browserfy
import React from 'react/addons';
import ComponentRoot from './components/root';

var mountNode = document.getElementById("react-main-mount");

React.render(new ComponentRoot({}), mountNode);
