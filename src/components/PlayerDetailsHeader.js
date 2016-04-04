import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import shell from 'shell';

class PlayerDetailsHeader extends Component {
  handleClickPlayerLink() {
    const base = 'https://www.easports.com/fifa/ultimate-team/fut/database/player/';
    shell.openExternal(`${base}${this.props.player.baseId}/${this.props.player.name}#${this.props.player.id}`);
  }

  render() {
    const player = this.props.player;
    const tabBioClasses = classNames({
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
            {player.firstName} {player.lastName}
          </div>
        </div>
        <div className="details-subheader">
          <div className="details-header-actions">
            <div className="action" onClick={this.props.updatePrice}>
              <div className="action-icon">
                <span className="icon icon-restart"></span>
              </div>
              <div className="btn-label">UPDATE</div>
            </div>
            <div className="action" onClick={this.handleClickPlayerLink.bind(this)}>
              <div className="action-icon">
                <span className="icon icon-open-external"></span>
              </div>
              <div className="btn-label">EA BIO</div>
            </div>
          </div>
          <div className="details-subheader-tabs">
            <span className={tabBioClasses}>Bio</span>
            <span className={tabSettingsClasses}>Settings</span>
          </div>
        </div>
      </div>
    );
  }
}

PlayerDetailsHeader.propTypes = {
  player: PropTypes.object.isRequired,
  updatePrice: PropTypes.func.isRequired
};

PlayerDetailsHeader.contextTypes = {
  router: PropTypes.object.isRequired
};

export default PlayerDetailsHeader;
