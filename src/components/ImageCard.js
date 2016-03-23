import $ from 'jquery';
import React, { Component, PropTypes } from 'react';
import RetinaImage from 'react-retina-image';
import numeral from 'numeral';

export default class ImageCard extends Component {
  static propTypes = {
    image: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      chosenTag: 'latest'
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  update() {
  }

  handleTagClick(tag) {
    this.setState({
      chosenTag: tag
    });
    const $tagOverlay = $(this.getDOMNode()).find('.tag-overlay');
    $tagOverlay.fadeOut(300);
  }

  handleClick() {
  }

  handleMenuOverlayClick() {
    const $menuOverlay = $(this.getDOMNode()).find('.menu-overlay');
    $menuOverlay.fadeIn(300);
  }

  handleCloseMenuOverlay() {
    const $menuOverlay = $(this.getDOMNode()).find('.menu-overlay');
    $menuOverlay.fadeOut(300);
  }

  handleTagOverlayClick() {
    const $tagOverlay = $(this.getDOMNode()).find('.tag-overlay');
    $tagOverlay.fadeIn(300);
  }

  handleCloseTagOverlay() {
    const $menuOverlay = $(this.getDOMNode()).find('.menu-overlay');
    $menuOverlay.hide();
    const $tagOverlay = $(this.getDOMNode()).find('.tag-overlay');
    $tagOverlay.fadeOut(300);
  }

  render() {
    const self = this;
    let name;
    if (this.props.image.namespace === 'library') {
      name = (
        <div>
          <div className="namespace official">official</div>
          <span className="repo">{this.props.image.name}</span>
        </div>
      );
    } else {
      name = (
        <div>
          <div className="namespace">{this.props.image.namespace}</div>
          <span className="repo">{this.props.image.name}</span>
        </div>
      );
    }
    let description;
    if (this.props.image.description) {
      description = this.props.image.description;
    } else {
      description = 'No description.';
    }
    const logoStyle = {
      backgroundColor: this.props.image.gradient_start
    };
    let imgsrc;
    if (this.props.image.img) {
      imgsrc = `https://kitematic.com/recommended/${this.props.image.img}`;
    } else {
      imgsrc = 'https://kitematic.com/recommended/kitematic_html.png';
    }
    let tags;
    if (self.state.loading) {
      tags = <RetinaImage className="tags-loading" src="loading.png" />;
    } else if (self.state.tags.length === 0) {
      tags = <div className="no-tags">No Tags</div>;
    } else {
      const tagDisplay = self.state.tags.map((tag) => {
        const t = tag.name;
        if (t === self.state.chosenTag) {
          return <div className="tag active" key={t} onClick={self.handleTagClick.bind(self, t)}>{t}</div>;
        }
        return <div className="tag" key={t} onClick={self.handleTagClick.bind(self, t)}>{t}</div>;
      });
      tags = (
        <div className="tag-list">
          {tagDisplay}
        </div>
      );
    }
    let badge = null;
    if (this.props.image.namespace === 'library') {
      badge = (
        <span className="icon icon-badge-official"></span>
      );
    } else if (this.props.image.is_private) {
      badge = (
        <span className="icon icon-badge-private"></span>
      );
    }
    const favCount = (this.props.image.star_count < 1000) ?
      numeral(this.props.image.star_count).value() : numeral(this.props.image.star_count).format('0.0a').toUpperCase();
    const pullCount = (this.props.image.pull_count < 1000) ?
      numeral(this.props.image.pull_count).value() : numeral(this.props.image.pull_count).format('0a').toUpperCase();
    return (
      <div className="image-item">
        <div className="overlay menu-overlay">
          <div className="menu-item" onClick={this.handleTagOverlayClick.bind(this, this.props.image.name)}>
            <span className="icon icon-tag"></span>
            <span className="text">SELECTED TAG: <span className="selected-tag">{this.state.chosenTag}</span></span>
          </div>
          <div className="close-overlay">
            <a className="btn btn-action circular" onClick={self.handleCloseMenuOverlay}>
              <span className="icon icon-delete"></span>
            </a>
          </div>
        </div>
        <div className="overlay tag-overlay">
          <p>Please select an image tag.</p>
          {tags}
          <div className="close-overlay" onClick={self.handleCloseTagOverlay}>
            <a className="btn btn-action circular"><span className="icon icon-delete"></span></a>
          </div>
        </div>
        <div className="logo" style={logoStyle}>
          <RetinaImage src={imgsrc} />
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
              <span className="text">{favCount}</span>
              <span className="icon icon-download"></span>
              <span className="text">{pullCount}</span>
            </div>
            <div className="more-menu" onClick={self.handleMenuOverlayClick}>
              <span className="icon icon-more"></span>
            </div>
            <div className="action" onClick={self.handleClick}>
              CREATE
            </div>
          </div>
        </div>
      </div>
    );
  }
}
