import React, { Component, PropTypes } from 'react';
// import DevTools from './DevTools';
export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  };

  render() {
    return (
      <div id="app-main">
        {this.props.children}
      </div>
    );
  }
}

// {
//   (() => {
//     if (process.env.NODE_ENV !== 'production') {
//       const DevTools = require('./DevTools');
//       return <DevTools />;
//     }
//   })()
// }
