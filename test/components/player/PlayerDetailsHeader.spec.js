import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { shallow } from 'enzyme';
import PlayerDetailsHeader from '../../../app/components/player/PlayerDetailsHeader';
import player, { totwPlayer } from '../../mocks/player';

const openExternal = spy(PlayerDetailsHeader.prototype, 'handleClickPlayerLink');

function setup(totw = false) {
  const actions = {
    updatePrice: spy()
  };
  const testPlayer = totw ? totwPlayer : player;
  const component = shallow(<PlayerDetailsHeader player={testPlayer} {...actions} />, context);
  return {
    component,
    actions,
    buttons: component.find('.action')
  };
}

describe('components', () => {
  describe('player', () => {
    describe('PlayerDetailsHeader', () => {
      it('should update price when update button is clicked', () => {
        const { actions, buttons } = setup();
        expect(buttons).to.have.length(2);
        buttons.at(0).simulate('click');
        expect(actions.updatePrice.calledOnce).to.be.true;
      });

      it('should launch EA DB when open external button is clicked', () => {
        const { buttons } = setup();
        expect(buttons).to.have.length(2);
        buttons.at(1).simulate('click');
        expect(openExternal.called).to.be.true;
      });
    });
  });
});
