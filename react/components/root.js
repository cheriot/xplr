import React from 'react';

class Root extends React.Component {
  render() {
    const brandTitle = {color: 'gray', fontSize: '23px'};
    const brandSubtitle = {color: 'lightgray', fontSize: '18px'};

    return (
      <div>
        <div className='container container-narrow header-branding'>
          <h1 style={brandTitle}>
            <a href='/'>Xplr.in</a>
            <span style={brandSubtitle}> the best in travel writing </span>
          </h1>
        </div>

        {this.props.children}
      </div>
    );
  }
}

module.exports = Root;
