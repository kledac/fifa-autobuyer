import React, { PropTypes, Component } from 'react';
import { shell } from 'electron';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PlayerListItem from '../components/player/PlayerListItem';
import Header from '../components/Header';
import metrics from '../utils/MetricsUtil';
import * as PlayerActions from '../actions/players';

class Players extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarOffset: 0,
      players: this.props.playerList || []
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      players: nextProps.playerList
    });
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

    const players = this.state.players
      .map(player => <PlayerListItem key={player.id} player={player} />);

    return (
      <div className="containers">
        <Header hideLogin={false} />
        <div className="containers-body">
          <div className="sidebar">
            <section className={sidebarHeaderClass}>
              <h4>Player List</h4>
              <div className="create">
                <Link to="/players">
                  <span className="btn btn-new btn-action has-icon btn-hollow">
                    <span className="icon icon-add" />Search
                  </span>
                </Link>
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
  playerList: PropTypes.arrayOf(PropTypes.shape({}))
};

Players.contextTypes = {
  router: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    playerList: state.playerList
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(PlayerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Players);
