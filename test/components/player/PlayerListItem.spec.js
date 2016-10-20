import React from 'react';
import { expect } from 'chai';
import { spy, stub } from 'sinon';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { PlayerListItem } from '../../../app/components/player/PlayerListItem';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const player = {
  nation: {
    imageUrls: {
      small: 'https://fifa17.content.easports.com/fifa/fltOnlineAssets/CC8267B6-0817-4842-BB6A-A20F88B05418/2017/fut/items/images/flags/html5/24x14/38.png'
    }
  },
  club: {
    imageUrls: {
      normal: {
        small: 'https://fifa17.content.easports.com/fifa/fltOnlineAssets/CC8267B6-0817-4842-BB6A-A20F88B05418/2017/fut/items/images/clubbadges/html5/normal/24x24/l243.png'
      }
    }
  },
  position: 'LW',
  name: 'Cristiano Ronaldo',
  color: 'rare_gold',
  id: '20801',
  rating: 94
};
spy(PlayerListItem.prototype, 'handleItemMouseEnter');
spy(PlayerListItem.prototype, 'handleItemMouseLeave');

function setup(active = false) {
  const actions = {
    remove: spy()
  };
  const store = mockStore({});
  const context = {
    context: {
      store,
      router: {
        push: spy(),
        replace: spy(),
        go: spy(),
        goBack: spy(),
        goForward: spy(),
        createHref: spy(),
        setRouteLeaveHook: spy(),
        isActive: stub().returns(active)
      }
    },
    childContextTypes: {
      store: React.PropTypes.object,
      router: React.PropTypes.object
    }
  };
  const component = shallow(<PlayerListItem player={player} {...actions} />, context);
  return {
    component,
    actions,
    li: component.find(`#${player.id}`),
    name: component.find('.name'),
    stats: component.find('.image'),
    remove: component.find('.btn.circular')
  };
}


describe('components', () => {
  describe('player', () => {
    describe('PlayerListItem', () => {
      it('should display player name', () => {
        const { name } = setup();
        expect(name).to.have.length(1);
        expect(name.text()).to.equal(player.name);
      });

      it('should display player stats', () => {
        const { stats } = setup();
        expect(stats).to.have.length(1);
        expect(stats.text()).to.equal(`${player.rating} | ${player.position}`);
      });

      it('should handle mouse events', () => {
        const { component, li } = setup();
        expect(li).to.have.length(1);
        li.simulate('mouseEnter');
        expect(component.instance().handleItemMouseEnter.called).to.be.true;
        li.simulate('mouseLeave');
        expect(component.instance().handleItemMouseLeave.called).to.be.true;
      });

      it('should call remove() when trying to delete player', () => {
        const { actions, remove } = setup(false);
        expect(remove).to.have.length(1);
        remove.simulate('click', { preventDefault: spy(), stopPropagation: spy() });
        expect(actions.remove.called).to.be.true;
      });

      it('should call push() when deleting a player while viewing details', () => {
        const { component, actions, remove } = setup(true);
        expect(remove).to.have.length(1);
        remove.simulate('click', { preventDefault: spy(), stopPropagation: spy() });
        expect(component.instance().context.router.push.called).to.be.true;
        expect(actions.remove.called).to.be.true;
      });
    });
  });
});
