import $ from 'jquery';
import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import electron from 'electron';
const remote = electron.remote;
const dialog = remote.dialog;
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as PlayerActions from '../actions/players';

class PlayerListItem extends Component {
  handleItemMouseEnter() {
    $(ReactDOM.findDOMNode(this)).find('.action').show();
  }

  handleItemMouseLeave() {
    $(ReactDOM.findDOMNode(this)).find('.action').hide();
  }

  handleDeletePlayer(e) {
    e.preventDefault();
    e.stopPropagation();
    dialog.showMessageBox({
      message: `Are you sure you want to remove ${this.props.player.name}?`,
      buttons: ['Remove', 'Cancel']
    }, (index) => {
      if (index === 0) {
        this.props.remove(this.props.player);
      }
    });
  }

  render() {
    const player = this.props.player;
    const className = `ut-item_affiliation--list-view ut-item--list-view-bg-${player.color}`;
    const card = (
      <OverlayTrigger placement="bottom" overlay={<Tooltip id="TOTY">TOTY</Tooltip>}>
        <div className={className}>
          <img src={player.club.imageUrls.normal.small} />
          <img src={player.nation.imageUrls.small} />
        </div>
      </OverlayTrigger>
    );

    return (
      <Link to={`/players/${player.id}`}>
        <li onMouseEnter={this.handleItemMouseEnter.bind(this)}
          onMouseLeave={this.handleItemMouseLeave.bind(this)}
          id={player.id}
        >
          {card}
          <div className="info">
            <div className="name">
              {player.name}
            </div>
            <div className="image">
              {player.rating} | {player.position}
            </div>
          </div>
          <div className="action">
            <span className="btn circular" onClick={this.handleDeletePlayer.bind(this)}>
              <span className="icon icon-delete"></span>
            </span>
          </div>
        </li>
      </Link>
    );
  }
}

PlayerListItem.propTypes = {
  player: PropTypes.object.isRequired,
  remove: PropTypes.func.isRequired
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(PlayerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerListItem);
