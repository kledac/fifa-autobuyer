import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PlayerDetailsHeader from './PlayerDetailsHeader';
import PlayerDetailTable from './PlayerDetailTable';
import * as PlayerActions from '../../actions/players';

class PlayerDetails extends Component {
  constructor(props) {
    super(props);
    this.player = props.players.list[props.params.id];
  }

  componentDidMount() {
    this.updatePrice();
  }

  componentWillReceiveProps(nextProps) {
    this.player = nextProps.players.list[nextProps.params.id];
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
  players: PropTypes.shape({
    list: PropTypes.arrayOf(PropTypes.shape({}))
  })
};

PlayerDetails.contextTypes = {
  router: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    players: state.players
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(PlayerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerDetails);
