import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { shell } from '../mocks/electron';
import player, { totwPlayer } from '../mocks/player';
import { Players } from '../../app/containers/Players';
import ConnectedPlayerListItem from '../../app/components/player/PlayerListItem';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

function setup(initialState = { account: {} }, pathname = '/players') {
  const store = mockStore(initialState);
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
        isActive: spy()
      }
    },
    childContextTypes: {
      store: React.PropTypes.object,
      router: React.PropTypes.object
    }
  };
  const component = mount(
    <Players {...initialState} location={{ pathname }}><div /></Players>,
    context
  );
  return {
    component,
    database: component.find('.btn-database'),
    feedback: component.find('.btn-feedback'),
    addPlayer: component.find('.btn-new'),
    sidebar: component.find('.sidebar-containers'),
    button: component.find('.create'),
    playerCards: component.find(ConnectedPlayerListItem)
  };
}


describe('containers', () => {
  describe('Players', () => {
    it('should call handleClickPlayerDatabase when database icon clicked', () => {
      const { database } = setup({
        account: {
          credits: 1000
        },
        player: {
          list: {},
          search: {}
        }
      });
      expect(database).to.have.length(1);
      database.simulate('click');
      expect(shell.openExternal.calledOnce).to.be.true;
      shell.openExternal.reset();
    });

    it('should call handleClickReportIssue when issue icon clicked', () => {
      const { feedback } = setup({
        account: {
          credits: 1000
        },
        player: {
          list: {},
          search: {}
        }
      });
      expect(feedback).to.have.length(1);
      feedback.simulate('click');
      expect(shell.openExternal.calledOnce).to.be.true;
      shell.openExternal.reset();
    });

    it('should show settings button when on /players', () => {
      const { button } = setup({
        account: {
          credits: 1000
        },
        player: {
          list: {},
          search: {}
        }
      });
      expect(button).to.have.length(1);
      expect(button.text()).to.equal('Settings');
    });

    it('should show search button when on /players/:id', () => {
      const { button } = setup({
        account: {
          credits: 1000
        },
        player: {
          list: {},
          search: {}
        }
      }, '/players/20801');
      expect(button).to.have.length(1);
      expect(button.text()).to.equal('Search');
    });

    it('should call handleScroll when scroll event happens in sidebar', () => {
      const { component, sidebar } = setup({
        account: {
          credits: 1000
        },
        player: {
          list: {},
          search: {}
        }
      });
      expect(sidebar).to.have.length(1);
      expect(component.find('.sidebar-header').is('.sep')).to.be.false;
      sidebar.simulate('scroll', { target: { scrollTop: 100 } });
      component.update();
      expect(component.find('.sidebar-header').is('.sep')).to.be.true;
      sidebar.simulate('scroll', { target: { scrollTop: 101 } });
      component.update();
      expect(component.find('.sidebar-header').is('.sep')).to.be.true;
      sidebar.simulate('scroll', { target: { scrollTop: 0 } });
      component.update();
      expect(component.find('.sidebar-header').is('.sep')).to.be.false;
    });

    it('should render n PlayerListItem components where n is number of players in list', () => {
      const { playerCards } = setup({
        account: {
          credits: 1000
        },
        player: {
          list: {
            20801: player,
            67276528: totwPlayer
          },
          search: {}
        }
      });
      expect(playerCards).to.have.length(2);
    });
  });
});
