import React, { PropTypes, Component } from 'react';
import { find } from 'lodash/collection';
import PlayerDetailsHeader from './PlayerDetailsHeader';
import PlayerCard from './PlayerCard';
import PlayerDetailTable from './PlayerDetailTable';
import { findPrice } from '../utils/ApiUtil';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as PlayerActions from '../actions/players';

class PlayerDetails extends Component {
  constructor(props) {
    super(props);
    this.player = find(props.playerList, { id: props.params.id });
    this.state = {
      lowest: '',
      total: ''
    };
  }

  componentDidMount() {
    this.updatePrice();
  }

  componentWillReceiveProps(nextProps) {
    this.player = find(nextProps.playerList, { id: nextProps.params.id });
    this.updatePrice();
  }

  updatePrice() {
    this.setState({ lowest: '', total: '' });
    findPrice(this.player.id).then((result) => {
      this.setState(result);
    });
  }

  render() {
    console.log(this.player);
    return (
      <div className="details">
        <PlayerDetailsHeader player={this.player} updatePrice={this.updatePrice.bind(this)} />
        <div className="details-panel home">
          <div className="content">
            <div className="full">
              <PlayerCard player={this.player} />
              {this.state.lowest}
              <PlayerDetailTable player={this.player} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PlayerDetails.propTypes = {
  params: PropTypes.object.isRequired,
  playerList: PropTypes.array.isRequired
};

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
