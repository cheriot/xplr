import React from 'react/addons';

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
    initExternalDOM(this.getDOMNode());
    // Start a new React render tree with our node and the children
    // passed in from above. This is the other side of the portal.
    renderChildren(this.props);
  }

  componentWillUnmount() {
    React.unmountComponentAtNode(this.node);
    destroyExternalDOM(this.getDOMNode());
  }

  componentWillReceiveProps(newProps) {
    // Pass updates to the other side of the portal.
    renderChildren(newProps);
    updateExternalDOM(this.getDOMNode(), newProps)
  }

  renderChildren(props) {
    React.renderComponent(<div>{this.props.children}</div>, node);
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
    return React.findDOMNode(this);
  }
}

module.export = BasePortal;
