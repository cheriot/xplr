import React from 'react';

class LoadingIndicator extends React.Component {

  render() {
    const indicatorStyles = {display: this.props.hideIndicator ? 'none' : 'initial'};

    if (!this.props.loading) {
      return <div />;
    } else {
      return (
        <div className='component-loading-indicator backdrop'>
          <div className='indicator' style={indicatorStyles} />
        </div>
      );
    }
  }

}

module.exports = LoadingIndicator
