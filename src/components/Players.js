import $ from 'jquery';
import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import PlayerListItem from './PlayerListItem';
import { Link } from 'react-router';
import Header from './Header';
import shell from 'shell';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as PlayerActions from '../actions/players';

class Players extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    playerList: PropTypes.array.isRequired
  };

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

  handleNewPlayer() {
    $(ReactDOM.findDOMNode(this)).find('.new-player-item').parent().fadeIn();
    this.context.router.push('/players');
  }

  handleClickPlayerDatabase() {
    shell.openExternal('https://www.easports.com/fifa/ultimate-team/fut/database');
  }

  handleClickReportIssue() {
    shell.openExternal('https://github.com/hunterjm/fifa-autobuyer/issues/new');
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
                    <span className="icon icon-start"></span>Bid
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
              <span className="btn-sidebar btn-terminal" onClick={this.handleClickPlayerDatabase}>
                <span className="text">Player Database</span>
              </span>
              <span className="btn-sidebar btn-feedback" onClick={this.handleClickReportIssue}>
                <span className="icon icon-feedback"></span>
              </span>
            </section>
          </div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

// <span className="btn-sidebar btn-preferences" onClick={this.handleClickPreferences}>
//   <span className="icon icon-preferences"></span>
// </span>

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
