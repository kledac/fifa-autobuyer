import $ from 'jquery';
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import electron from 'electron';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as PlayerActions from '../actions/players';

const remote = electron.remote;
const dialog = remote.dialog;

class PlayerListItem extends Component {
  handleItemMouseEnter() {
    $(this.node).find('.action').show();
  }

  handleItemMouseLeave() {
    $(this.node).find('.action').hide();
  }

  handleDeletePlayer(e) {
    e.preventDefault();
    e.stopPropagation();
    dialog.showMessageBox({
      message: `Are you sure you want to remove ${this.props.player.name}?`,
      buttons: ['Remove', 'Cancel']
    }, index => {
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
          <img role="presentation" src={player.club.imageUrls.normal.small} />
          <img role="presentation" src={player.nation.imageUrls.small} />
        </div>
      </OverlayTrigger>
    );

    return (
      <div ref={node => (this.node = node)}>
        <Link to={`/players/${player.id}`}>
          <li
            onMouseEnter={this.handleItemMouseEnter.bind(this)}
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
                <span className="icon icon-delete" />
              </span>
            </div>
          </li>
        </Link>
      </div>
    );
  }
}

PlayerListItem.propTypes = {
  player: PropTypes.shape({
    name: PropTypes.string
  }),
  remove: PropTypes.func.isRequired
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(PlayerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerListItem);
