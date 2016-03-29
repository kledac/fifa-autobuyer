import React, { PropTypes, Component } from 'react';
import { find } from 'lodash/collection';
import PlayerDetailsHeader from './PlayerDetailsHeader';
import PlayerCard from './PlayerCard';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as PlayerActions from '../actions/players';

class PlayerDetails extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    playerList: PropTypes.array.isRequired
  };

  render() {
    const player = find(this.props.playerList, { id: this.props.params.id });
    return (
      <div className="details">
        <PlayerDetailsHeader player={player} />
        <div className="details-panel home">
          <div className="content">
            <div className="full">
              <PlayerCard player={player} />
              {player.name}
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
