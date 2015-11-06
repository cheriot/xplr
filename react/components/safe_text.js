import React from 'react/addons';

class SafeText extends React.Component {

  render() {
    return <span>{this.safeUnescape(this.props.text)}</span>
  }

  safeUnescape(text) {
    // Don't use the DOM to unescape text:
    // http://benv.ca/2012/10/02/you-are-probably-misusing-DOM-text-methods/
    // Instead, whack-a-html-entity:
    return String(text)
      .replace(/&#8217;/g, '’')
      .replace(/&amp;/g, '&');
  }

}

module.exports = SafeText;
