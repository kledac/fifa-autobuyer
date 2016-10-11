import $ from 'jquery';
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { remote } from 'electron';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as PlayerActions from '../../actions/player';

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
    remote.dialog.showMessageBox({
      message: `Are you sure you want to remove ${this.props.player.name}?`,
      buttons: ['Remove', 'Cancel']
    }, index => {
      if (index === 0) {
        if (this.context.router.isActive(`/players/${this.props.player.id}`)) {
          this.context.router.push('/players');
        }
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
    id: PropTypes.int,
    name: PropTypes.string
  }),
  remove: PropTypes.func.isRequired
};

PlayerListItem.contextTypes = {
  router: PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(PlayerActions, dispatch);
}

export default connect(() => ({}), mapDispatchToProps)(PlayerListItem);
