import React from 'react';
import ReactDOM from 'react-dom';

// Based on
// https://github.com/ryanflorence/react-training/blob/gh-pages/lessons/05-wrapping-dom-libs.md
//
// Subclass and implement:
// * initExternalDOM(node)
// * updateExternalDOM(node, newProps)
// * destroyExternalDOM(node)

class BasePortal extends React.Component {

  render() {
    // Don't render anything to open a "portal" in react's dom for the external markup.
    return <div/>;
  }

  componentDidMount() {
    this.initExternalDOM(this.getDOMNode());
    // Start a new React render tree with our node and the children
    // passed in from above. This is the other side of the portal.
    this.renderChildren(this.props);
  }

  componentWillUnmount() {
    this.destroyExternalDOM(this.getDOMNode());
    // ???
    // ReactDOM.unmountComponentAtNode(this.getDOMNode());
  }

  componentWillReceiveProps(newProps) {
    // Pass updates to the other side of the portal.
    this.renderChildren(newProps);
    this.updateExternalDOM(this.getDOMNode(), newProps)
  }

  renderChildren(props) {
    // How can I properly handle nested content in a portal?
    // ReactDOM.render(<div>{this.props.children}</div>, this.getDOMNode());
  }

  initExternalDOM(node) {
    // Use `node` to create the non-react DOM.
  }

  updateExternalDOM(node, newProps) {
    // Use `props` to detect changes that need to trigger actions on the
    // external DOM. Ex: open or close a dialog box.
  }

  destroyExternalDOM(node) {
    // The react component has been remove, "unmounted", so remove the external
    // library's DOM as well.
  }

  getDOMNode() {
    return ReactDOM.findDOMNode(this);
 }
}

module.exports = BasePortal;
