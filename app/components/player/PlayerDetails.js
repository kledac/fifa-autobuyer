import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import PlayerDetailsHeader from './PlayerDetailsHeader';
import PlayerDetailTable from './PlayerDetailTable';
import * as PlayerActions from '../../actions/player';

class PlayerDetails extends Component {
  constructor(props) {
    super(props);
    this.player = props.player.list[props.params.id];
  }

  componentDidMount() {
    this.updatePrice();
  }

  shouldComponentUpdate(nextProps) {
    const id = this.props.params.id;
    const nextId = nextProps.params.id;
    const price = _.get(this.props.player, `list[${this.props.params.id}].price.lowest`, '');
    const nextPrice = _.get(nextProps.player, `list[${this.props.params.id}].price.lowest`, '');

    if (nextId === id && nextPrice === price) {
      return false;
    }
    return true;
  }

  componentWillUpdate(nextProps) {
    this.player = nextProps.player.list[nextProps.params.id];
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
  player: PropTypes.shape({
    list: PropTypes.shape({})
  })
};

PlayerDetails.contextTypes = {
  router: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    player: state.player
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(PlayerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerDetails);
