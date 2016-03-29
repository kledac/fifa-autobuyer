import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';

class PlayerDetails extends Component {
  static propTypes = {
    player: PropTypes.object.isRequired
  };

  handleGoBackClick() {
    this.context.router.push('/players');
  }

  render() {
    const player = this.props.player;
    const tabHomeClasses = classNames({
      'details-tab': true,
      active: true,
      disabled: false
    });
    const tabSettingsClasses = classNames({
      'details-tab': true,
      active: false,
      disabled: true
    });
    return (
      <div>
        <div className="header-section">
          <div className="text">
            {player.name}
          </div>
        </div>
        <div className="details-subheader">
          <div className="details-header-actions">
            <div className="action">
              <div className="action-icon" onClick={this.handleGoBackClick.bind(this)}>
                <span className="icon icon-search"></span>
              </div>
              <div className="btn-label">GO BACK</div>
            </div>
            <div className="action">
              <div className="action-icon">
                <span className="icon icon-restart"></span>
              </div>
              <div className="btn-label">UPDATE</div>
            </div>
          </div>
          <div className="details-subheader-tabs">
            <span className={tabHomeClasses}>Home</span>
            <span className={tabSettingsClasses}>Settings</span>
          </div>
        </div>
      </div>
    );
  }
}

PlayerDetails.contextTypes = {
  router: PropTypes.object.isRequired
};
export default PlayerDetails;
