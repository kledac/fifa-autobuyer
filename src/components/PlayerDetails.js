import React, { PropTypes, Component } from 'react';
import { find } from 'lodash/collection';
import PlayerCard from './PlayerCard';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as PlayerActions from '../actions/players';

class PlayerDetails extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    playerList: PropTypes.array.isRequired
  };

  handleGoBackClick() {
    this.context.router.goBack();
  }

  render() {
    const player = find(this.props.playerList, { id: this.props.params.id });
    return (
      <div className="details">
        <div className="header-section">
          <div className="text">
            {player.name}
          </div>
        </div>
        <div className="details-panel home">
          <div className="content">
            <div className="full">
              <a onClick={this.handleGoBackClick.bind(this)}>Go Back</a>
              <PlayerCard player={player} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PlayerDetails.contextTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(PlayerDetails);
