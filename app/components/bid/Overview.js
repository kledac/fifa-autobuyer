import $ from 'jquery';
import _ from 'lodash';
import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Fut from 'fut-promise';
import * as BidActions from '../../actions/bid';

export class Overview extends Component {
  async componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
    if (!this.props.bidding) {
      await this.props.getWatchlist(this.props.email);
      await this.props.getTradepile(this.props.email);
    }
  }

  shouldComponentUpdate() {
    // TODO: figure out when this needs to update (hint: not always)
    return true;
  }

  componentDidUpdate() {
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    $('.settings-panel').height(window.innerHeight - 170);
  }

  render() {
    const tabClasses = classNames({
      'details-tab': true,
      active: true,
      disabled: false
    });

    const watchlist = _.get(this.props.bid, 'watchlist', []);
    const tradepile = _.get(this.props.bid, 'tradepile', []);

    return (
      <div className="details">
        <div>
          <div className="header-section">
            <div className="text">
              Bidding Overview
            </div>
          </div>
          <div className="details-subheader">
            <div className="details-header-actions">
              {
                this.props.bidding
                ?
                  (
                    <div className="action" onClick={() => this.props.stop()}>
                      <div className="action-icon">
                        <span className="icon icon-stop" />
                      </div>
                      <div className="btn-label">STOP</div>
                    </div>
                  )
                :
                  (
                    <div className="action" onClick={() => this.props.start()}>
                      <div className="action-icon">
                        <span className="icon icon-start" />
                      </div>
                      <div className="btn-label">START</div>
                    </div>
                  )
              }
            </div>
            <div className="details-subheader-tabs">
              <span className={tabClasses}>Current</span>
            </div>
          </div>
        </div>
        <div className="details-panel">
          <div className="settings">
            <div className="settings-panel">
              <h1>Buying <small>({watchlist.length}/{this.props.pilesize.watchlist})</small></h1>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Max Price</th>
                    <th>List Price</th>
                    <th>BIN Price</th>
                    <th>Current Bid</th>
                    <th>Expires</th>
                  </tr>
                </thead>
                <tbody>
                  {_.map(
                    watchlist,
                    item => {
                      const player = _.get(
                        this.props.player,
                        `list.${Fut.getBaseId(item.itemData.resourceId)}`,
                        {}
                      );
                      return (
                        <tr key={`watchlist-${item.tradeId}`}>
                          <td>{player.name}</td>
                          <td>{item.bidState}</td>
                          <td>{player.price.buy}</td>
                          <td>{item.startingBid}</td>
                          <td>{item.buyNowPrice}</td>
                          <td>{item.currentBid}</td>
                          <td>{item.expires}</td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
              <h1>Selling <small>({tradepile.length}/{this.props.pilesize.tradepile})</small></h1>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Bought For</th>
                    <th>List Price</th>
                    <th>BIN Price</th>
                    <th>Current Bid</th>
                    <th>Expires</th>
                  </tr>
                </thead>
                <tbody>
                  {_.map(
                    tradepile,
                    item => {
                      const player = _.get(
                        this.props.player,
                        `list.${Fut.getBaseId(item.itemData.resourceId)}`,
                        {}
                      );
                      return (
                        <tr key={`tradepile-${item.tradeId}`}>
                          <td>{player.name}</td>
                          <td>
                            {
                              item.itemData.itemState === 'invalid'
                              ? 'sold'
                              : item.itemData.itemState
                            }
                          </td>
                          <td>{item.itemData.lastSalePrice || 'N/A'}</td>
                          <td>{item.startingBid}</td>
                          <td>{item.buyNowPrice}</td>
                          <td>{item.currentBid}</td>
                          <td>{item.expires}</td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Overview.propTypes = {
  player: PropTypes.shape({
    list: PropTypes.shape({})
  }),
  bid: PropTypes.shape({}),
  bidding: PropTypes.bool,
  email: PropTypes.string,
  pilesize: PropTypes.shape({
    watchlist: PropTypes.number.isRequired,
    tradepile: PropTypes.number.isRequired,
  }),
  start: PropTypes.func.isRequired,
  stop: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    player: state.player,
    bid: state.bid,
    bidding: state.bid.bidding,
    email: state.account.email,
    pilesize: state.account.pilesize,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(BidActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
