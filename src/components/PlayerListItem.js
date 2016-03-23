import $ from 'jquery';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import electron from 'electron';
const remote = electron.remote;
const dialog = remote.dialog;
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

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
      message: 'Are you sure you want to remove this player?',
      buttons: ['Remove', 'Cancel']
    }, (index) => {
      if (index === 0) {
        // TODO: Remove Player
      }
    });
  }

  render() {
    const baseURL = 'https://fifa15.content.easports.com/fifa/fltOnlineAssets/B488919F-23B5-497F-9FC0-CACFB38863D0/';
    const badge = `${baseURL}2016/fut/items/images/clubbadges/html5/normal/24x24/l243.png`;
    const flag = `${baseURL}2016/fut/items/images/flags/html5/24x14/38.png`;
    const state = (
      <OverlayTrigger placement="bottom" overlay={<Tooltip id="TOTY">TOTY</Tooltip>}>
        <div className="ut-item_affiliation--list-view ut-item--list-view-bg-rare_gold">
          <img style={{ margin: '6px 0 0 8px' }} src={badge} />
          <img style={{ margin: '-2px 0 0 8px' }} src={flag} />
        </div>
      </OverlayTrigger>
    );

    return (
      <Link to="details" params={{ id: 123 }}>
        <li onMouseEnter={this.handleItemMouseEnter.bind(this)}
          onMouseLeave={this.handleItemMouseLeave.bind(this)}
          id="123"
        >
          {state}
          <div className="info">
            <div className="name">
              Christiano Ronaldo
            </div>
            <div className="image">
              93 | LW | Rare Gold
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

export default PlayerListItem;
