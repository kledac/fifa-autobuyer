import React, { PropTypes, Component } from 'react';
import utils from '../utils/Util';

let packages;
try {
  packages = utils.packagejson();
} catch (err) {
  packages = {};
}

class About extends Component {
  handleGoBackClick() {
    this.context.router.goBack();
  }
  render() {
    return (
      <div className="preferences">
        <div className="about-content">
          <a onClick={this.handleGoBackClick.bind(this)}>Go Back</a>
            <div className="items">
              <div className="item">
                <h3>FIFA Autobuyer</h3>
                <p>{packages.description}</p>
              </div>
            </div>
            <div className="items">
              <div className="item">
                <h4>Version</h4>
                <p>{packages.version}</p>
              </div>
            </div>
          <div className="items">
            <div className="item">
              <h4>Author</h4>
              <p>{packages.author}</p>
            </div>
            <div className="item">
              <h4>License</h4>
              <p>{packages.license}</p>
            </div>
          </div>
          <div className="items">
            <div className="item">
              <h4>Electron</h4>
              <p>{packages['electron-version']}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

About.contextTypes = {
  router: PropTypes.object.isRequired
};

export default About;
