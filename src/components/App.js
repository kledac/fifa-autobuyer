import React, { Component, PropTypes } from 'react';
// import DevTools from './DevTools';

class App extends Component {
  render() {
    return (
      <div id="app-main">
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element.isRequired
};

export default App;

// {
//   (() => {
//     if (process.env.NODE_ENV !== 'production') {
//       const DevTools = require('./DevTools');
//       return <DevTools />;
//     }
//   })()
// }
