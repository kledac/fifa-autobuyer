import $ from 'jquery';
import _ from 'lodash';
import React, { PropTypes, Component } from 'react';
import PlayerSearch from './PlayerSearch';
import PlayerListItem from './PlayerListItem';
import { Link } from 'react-router';
// import PlayerList from './PlayerList';
import Header from './Header';
import shell from 'shell';

class Players extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sidebarOffset: 0,
      players: [],
      sorted: []
    };
  }

  sorted(containers) {
    return _.values(containers).sort((a, b) => {
      if (a.State.Downloading && !b.State.Downloading) {
        return -1;
      } else if (!a.State.Downloading && b.State.Downloading) {
        return 1;
      }
      if (a.State.Running && !b.State.Running) {
        return -1;
      } else if (!a.State.Running && b.State.Running) {
        return 1;
      }
      return a.Name.localeCompare(b.Name);
    });
  }

  update() {
    const players = [];
    const sorted = this.sorted([]);

    this.setState({
      players,
      sorted
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
    $(this.getDOMNode()).find('.new-player-item').parent().fadeIn();
    this.context.router.push('/players');
  }

  handleClickPlayerDatabase() {
    shell.openExternal('https://www.easports.com/fifa/ultimate-team/fut/database');
  }

  handleClickPreferences() {
    // this.context.router.push('/preferences');
  }

  handleClickReportIssue() {
    shell.openExternal('https://github.com/hunterjm/fifa-autobuyer/issues/new');
  }

  render() {
    let sidebarHeaderClass = 'sidebar-header';
    if (this.state.sidebarOffset) {
      sidebarHeaderClass += ' sep';
    }

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
                <PlayerListItem />
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
          <PlayerSearch />
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

export default Players;
