import React, { PropTypes, Component } from 'react';
import { shell } from 'electron';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';
import ConnectedPlayerListItem from '../components/player/PlayerListItem';
import ConnectedHeader from '../components/Header';
import metrics from '../utils/MetricsUtil';

export class Players extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarOffset: 0
    };
  }

  handleScroll(e) {
    if (e.target.scrollTop > 0 && !this.state.sidebarOffset) {
      this.setState({
        sidebarOffset: e.target.scrollTop
      });
    } else if (e.target.scrollTop === 0 && this.state.sidebarOffset) {
      this.setState({
        sidebarOffset: 0
      });
    }
  }

  handleClickPlayerDatabase() {
    metrics.track('Opened Player Database', {
      from: 'app'
    });
    shell.openExternal('https://www.easports.com/fifa/ultimate-team/fut/database');
  }

  handleClickReportIssue() {
    metrics.track('Opened Issue Reporter', {
      from: 'app'
    });
    shell.openExternal('https://github.com/hunterjm/fifa-autobuyer/issues');
  }

  render() {
    let sidebarHeaderClass = 'sidebar-header';
    if (this.state.sidebarOffset) {
      sidebarHeaderClass += ' sep';
    }

    const players = _.map(
      _.get(this.props, 'player.list', {}),
      player => <ConnectedPlayerListItem key={player.id} player={player} />
    );

    return (
      <div className="containers">
        <ConnectedHeader hideLogin={false} />
        <div className="containers-body">
          <div className="sidebar">
            <section className={sidebarHeaderClass}>
              <h4>Player List</h4>
              <div className="create">
                {
                  this.props.location.pathname === '/players'
                  ?
                    <Link to="/settings">
                      <span className="btn btn-new btn-action has-icon btn-hollow">
                        <span className="icon icon-preferences" />Settings
                      </span>
                    </Link>
                  :
                    <Link to="/players">
                      <span className="btn btn-new btn-action has-icon btn-hollow">
                        <span className="icon icon-search" />Search
                      </span>
                    </Link>
                }
              </div>
            </section>
            <section className="sidebar-containers" onScroll={this.handleScroll.bind(this)}>
              <ul>
                {players}
              </ul>
            </section>
            <section className="sidebar-buttons">
              <span className="btn-sidebar btn-database" onClick={this.handleClickPlayerDatabase}>
                <span className="text">Player Database</span>
              </span>
              <span className="btn-sidebar btn-feedback" onClick={this.handleClickReportIssue}>
                <span className="icon icon-feedback" />
              </span>
              <span className="btn-sidebar btn-start">
                <span className="icon icon-start" />
              </span>
            </section>
          </div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

Players.propTypes = {
  children: PropTypes.element.isRequired,
  player: PropTypes.shape({}),
  location: PropTypes.shape({
    pathname: PropTypes.string
  })
};

Players.contextTypes = {
  router: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    player: state.player
  };
}

export default connect(mapStateToProps)(Players);
