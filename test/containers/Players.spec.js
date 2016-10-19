import React from 'react';
import { expect } from 'chai';
import { assert, stub, spy } from 'sinon';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Players } from '../../app/containers/Players';
import PlayerListItem from '../../app/components/player/PlayerListItem';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const databaseStub = stub(Players.prototype, 'handleClickPlayerDatabase');
const feedbackStub = stub(Players.prototype, 'handleClickReportIssue');

function setup(initialState = { account: {} }) {
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
  const component = mount(<Players {...initialState}><div /></Players>, context);
  return {
    component,
    database: component.find('.btn-database'),
    feedback: component.find('.btn-feedback'),
    addPlayer: component.find('.btn-new'),
    sidebar: component.find('.sidebar-containers'),
    playerCards: component.find(PlayerListItem)
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
      assert.called(databaseStub);
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
      assert.called(feedbackStub);
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
            20801: {
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
            },
            158023: {
              nation: {
                imageUrls: {
                  small: 'https://fifa17.content.easports.com/fifa/fltOnlineAssets/CC8267B6-0817-4842-BB6A-A20F88B05418/2017/fut/items/images/flags/html5/24x14/52.png'
                }
              },
              club: {
                imageUrls: {
                  normal: {
                    small: 'https://fifa17.content.easports.com/fifa/fltOnlineAssets/CC8267B6-0817-4842-BB6A-A20F88B05418/2017/fut/items/images/clubbadges/html5/normal/24x24/l241.png'
                  }
                }
              },
              position: 'RW',
              name: 'Messi',
              color: 'rare_gold',
              id: '158023',
              rating: 93
            },
            67276528: {
              nation: {
                imageUrls: {
                  small: 'https://fifa17.content.easports.com/fifa/fltOnlineAssets/CC8267B6-0817-4842-BB6A-A20F88B05418/2017/fut/items/images/flags/html5/24x14/52.png'
                }
              },
              club: {
                imageUrls: {
                  normal: {
                    small: 'https://fifa17.content.easports.com/fifa/fltOnlineAssets/CC8267B6-0817-4842-BB6A-A20F88B05418/2017/fut/items/images/clubbadges/html5/normal/24x24/l45.png'
                  }
                }
              },
              position: 'ST',
              name: 'Higuaín',
              color: 'totw_gold',
              id: '67276528',
              rating: 89
            }
          },
          search: {}
        }
      });
      expect(playerCards).to.have.length(3);
    });
  });
});
