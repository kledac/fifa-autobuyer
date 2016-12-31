/* eslint-disable no-unused-expressions */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';
import { mockLogin } from '../mocks/login';
import { mockApi, PLAYER_ID } from '../mocks/api';
import { init } from '../../app/utils/ApiUtil';
import * as actions from '../../app/actions/player';
import * as types from '../../app/actions/playerTypes';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actions', () => {
  describe('player', () => {
    describe('creators', () => {
      it('setPrice should create SET_PRICE action', () => {
        const id = '123456';
        const price = { lowest: 1000, total: 3 };
        expect(actions.setPrice(id, price)).to.eql(
          { type: types.SET_PRICE, id, price }
        );
      });

      it('add should create ADD_PLAYER action', () => {
        const player = { id: '123456' };
        expect(actions.add(player)).to.eql(
          { type: types.ADD_PLAYER, player }
        );
      });

      it('remove should create REMOVE_PLAYER action', () => {
        const player = { id: '123456' };
        expect(actions.remove(player)).to.eql(
          { type: types.REMOVE_PLAYER, player }
        );
      });
    });
    describe('async creators', () => {
      afterEach(() => {
        nock.cleanAll();
      });

      it('should dispatch SAVE_SEARCH_RESULTS when search() is completed', () => {
        // Mock search response
        const results = {
          count: 3,
          items: [
            { id: '158023' },
            { id: '202350' },
            { id: '224286' }
          ],
          page: 1,
          totalPages: 1,
          totalResults: 3,
          type: 'FUTPlayerItemList'
        };
        nock('https://www.easports.com')
          .get('/uk/fifa/ultimate-team/api/fut/item').query(true)
          .reply(200, results);

        const store = mockStore({});

        return store.dispatch(actions.search('messi'))
          .then(() => { // return of async actions
            expect(store.getActions()).to.include({ type: types.SAVE_SEARCH_RESULTS, results });
          });
      });

      it('should dispatch SET_PRICE when findPrice() is completed', async () => {
        const initialState = {
          account: {
            email: 'test@test.com',
            password: 'Password1',
            secret: 'test',
            platform: 'xone'
          },
          player: {
            search: {},
            list: {}
          }
        };

        const store = mockStore(initialState);
        mockLogin();
        mockApi();

        const api = init(initialState.account, () => {}, () => {});
        await api.login();
        // Dispatch with lowest already set to trigger SET_PRICE
        await store.dispatch(actions.findPrice(PLAYER_ID));
        expect(store.getActions()[0].type).to.eql(types.SET_PRICE);
      });
    });
  });
});
