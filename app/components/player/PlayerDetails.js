import React, { PropTypes, Component } from 'react';
import { find } from 'lodash/collection';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PlayerDetailsHeader from './PlayerDetailsHeader';
import PlayerDetailTable from './PlayerDetailTable';
import * as PlayerActions from '../../actions/players';

class PlayerDetails extends Component {
  constructor(props) {
    super(props);
    this.player = find(props.playerList, { id: props.params.id });
  }

  componentDidMount() {
    this.updatePrice();
  }

  componentWillReceiveProps(nextProps) {
    this.player = find(nextProps.playerList, { id: nextProps.params.id });
    this.updatePrice();
  }

  updatePrice() {
    this.props.findPrice(this.player.id);
  }

  render() {
    return (
      <div className="details">
        <PlayerDetailsHeader player={this.player} updatePrice={this.updatePrice.bind(this)} />
        <div className="details-panel home">
          <div className="content">
            <div className="full">
              <PlayerDetailTable player={this.player} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PlayerDetails.propTypes = {
  findPrice: PropTypes.func.isRequired,
  params: PropTypes.shape({
    id: PropTypes.int
  }),
  playerList: PropTypes.arrayOf(PropTypes.shape({}))
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
