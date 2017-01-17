import React, { PropTypes, Component } from 'react';
import { shell } from 'electron';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';
import classNames from 'classnames';
import ConnectedPlayerListItem from '../components/player/PlayerListItem';
import ConnectedHeader from '../components/Header';
import metrics from '../utils/MetricsUtil';
import * as PlayerActions from '../actions/player';
import * as BidActions from '../actions/bid';

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

  handleClickClearList() {
    this.props.clear();
    this.context.router.push('/players');
  }

  handleClickReportIssue() {
    metrics.track('Opened Issue Reporter', {
      from: 'app'
    });
    shell.openExternal('https://github.com/hunterjm/fifa-autobuyer/issues');
  }

  handleToggleBidding() {
    if (this.props.bidding) {
      this.props.stop();
    } else {
      this.props.start();
      this.context.router.push('/players/overview');
    }
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

    const overviewClasses = classNames({
      state: true,
      'state-stopped': !this.props.bidding,
      'state-running': this.props.bidding,
    });

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
                <div ref={node => (this.node = node)}>
                  <Link to="/players/overview">
                    <li id="overview">
                      <div className={overviewClasses} />
                      <div className="info">
                        <div className="name">
                          Bidding Overview
                        </div>
                        <div className="image">
                          Review bidding status
                        </div>
                      </div>
                    </li>
                  </Link>
                </div>
                {players}
              </ul>
            </section>
            <section className="sidebar-buttons">
              <span className="btn-sidebar btn-database" onClick={this.handleClickClearList.bind(this)}>
                <span className="text">Clear List</span>
              </span>
              <span className="btn-sidebar btn-feedback" onClick={this.handleClickReportIssue}>
                <span className="icon icon-feedback" />
              </span>
              {
                this.props.bidding
                ?
                  (<span className="btn-sidebar btn-stop" onClick={() => this.handleToggleBidding()}>
                    <span className="icon icon-stop" />
                  </span>)
                :
                  (<span className="btn-sidebar btn-start" onClick={() => this.handleToggleBidding()}>
                    <span className="icon icon-start" />
                  </span>)
              }
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
  }),
  bidding: PropTypes.bool,
  start: PropTypes.func,
  stop: PropTypes.func,
  clear: PropTypes.func,
};

Players.contextTypes = {
  router: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    player: state.player,
    bidding: state.bid.bidding
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...PlayerActions, ...BidActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Players);
