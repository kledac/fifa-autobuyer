import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mount } from 'enzyme';
import { PlayerDetails } from '../../../app/components/player/PlayerDetails';
import player, { totwPlayer } from '../../mocks/player';

const shouldUpdate = spy(PlayerDetails.prototype, 'shouldComponentUpdate');

function setup() {
  const actions = {
    findPrice: spy()
  };
  const props = {
    account: {},
    player: {
      list: {},
      search: {}
    },
    params: {
      id: player.id
    }
  };
  props.player.list[player.id] = player;
  props.player.list[totwPlayer.id] = totwPlayer;
  const component = mount(<PlayerDetails {...actions} {...props} />, context);
  return {
    component,
    actions
  };
}

describe('components', () => {
  describe('player', () => {
    describe('PlayerDetails', () => {
      it('should update price on load', () => {
        const { actions } = setup();
        expect(actions.findPrice.called).to.be.true;
      });

      it('should not update with same params', () => {
        const { component, actions } = setup();
        component.setProps({ params: { id: player.id } });
        expect(shouldUpdate.returned(false)).to.be.true;
        expect(actions.findPrice.calledOnce).to.be.true;
      });

      it('should update when given new id', () => {
        const { component, actions } = setup();
        expect(actions.findPrice.calledOnce).to.be.true;
        component.setProps({ params: { id: totwPlayer.id } });
        expect(shouldUpdate.returned(true)).to.be.true;
        expect(actions.findPrice.calledTwice).to.be.true;
      });
    });
  });
});
