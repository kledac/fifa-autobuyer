import $ from 'jquery';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class ImageCard extends Component {
  static propTypes = {
    player: PropTypes.object
  };

  handleTagClick() {
    const $tagOverlay = $(ReactDOM.findDOMNode(this)).find('.tag-overlay');
    $tagOverlay.fadeOut(300);
  }

  handleClick() {
  }

  handleMenuOverlayClick() {
    const $menuOverlay = $(ReactDOM.findDOMNode(this)).find('.menu-overlay');
    $menuOverlay.fadeIn(300);
  }

  handleCloseMenuOverlay() {
    const $menuOverlay = $(ReactDOM.findDOMNode(this)).find('.menu-overlay');
    $menuOverlay.fadeOut(300);
  }

  handleTagOverlayClick() {
    const $tagOverlay = $(ReactDOM.findDOMNode(this)).find('.tag-overlay');
    $tagOverlay.fadeIn(300);
  }

  handleCloseTagOverlay() {
    const $menuOverlay = $(ReactDOM.findDOMNode(this)).find('.menu-overlay');
    $menuOverlay.hide();
    const $tagOverlay = $(ReactDOM.findDOMNode(this)).find('.tag-overlay');
    $tagOverlay.fadeOut(300);
  }

  render() {
    const name = (
        <div>
          <div className="namespace">{this.props.player.club.abbrName}</div>
          <span className="repo">{this.props.player.name}</span>
        </div>
      );
    const description = this.props.player.playerType;
    const imgsrc = this.props.player.headshotImgUrl;
    const badge = null;
    let tags;
    if (!this.props.player.specialities || !this.props.player.specialities.length) {
      tags = <div className="no-tags">No specialities</div>;
    } else {
      const tagDisplay = this.props.player.specialities.map(
        tag => <div className="tag" key={tag} onClick={this.handleTagClick.bind(this, tag)}>{tag}</div>
      );
      tags = (
        <div className="tag-list">
          {tagDisplay}
        </div>
      );
    }
    return (
      <div className="image-item">
        <div className="overlay menu-overlay">
          <div className="menu-item" onClick={this.handleTagOverlayClick.bind(this, this.props.player.name)}>
            <span className="icon icon-tag"></span>
          </div>
          <div className="close-overlay">
            <a className="btn btn-action circular" onClick={this.handleCloseMenuOverlay.bind(this)}>
              <span className="icon icon-delete"></span>
            </a>
          </div>
        </div>
        <div className="overlay tag-overlay">
          <p>Please select an image tag.</p>
          {tags}
          <div className="close-overlay" onClick={this.handleCloseTagOverlay.bind(this)}>
            <a className="btn btn-action circular"><span className="icon icon-delete"></span></a>
          </div>
        </div>
        <div className="logo">
          <img src={imgsrc} />
        </div>
        <div className="card">
          <div className="info">
            <div className="badges">
              {badge}
            </div>
            <div className="name">
              {name}
            </div>
            <div className="description">
              {description}
            </div>
          </div>
          <div className="actions">
            <div className="favorites">
              <span className="icon icon-favorite"></span>
              <span className="text">0</span>
              <span className="icon icon-download"></span>
              <span className="text">0</span>
            </div>
            <div className="more-menu" onClick={this.handleMenuOverlayClick.bind(this)}>
              <span className="icon icon-more"></span>
            </div>
            <div className="action" onClick={this.handleClick.bind(this)}>
              ADD
            </div>
          </div>
        </div>
      </div>
    );
  }
}
