/* eslint-disable no-unused-expressions */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';
import { mockLogin } from '../mocks/login';
import * as actions from '../../app/actions/account';
import * as types from '../../app/actions/accountTypes';

const version = 17;
const email = 'test@test.com';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actions', () => {
  describe('account', () => {
    describe('creators', () => {
      it('should create SET_ACCOUNT_INFO action when setAccountInfo() is called', () => {
        const key = 'email';
        const value = 'test@test.com';
        expect(actions.setAccountInfo(key, value)).to.eql(
          { type: types.SET_ACCOUNT_INFO, key, value }
        );
      });

      it('should create SET_CREDITS action when setCredits() is called', () => {
        const credits = 1000;
        expect(actions.setCredits(credits)).to.eql(
          { type: types.SET_CREDITS, credits }
        );
      });

      it('should create SET_PILESIZE action when setPilesize() is called', () => {
        const { key, value } = { key: 'tradepile', value: 30 };
        expect(actions.setPilesize(key, value)).to.eql(
          { type: types.SET_PILESIZE, key, value }
        );
      });
    });
    describe('async creators', () => {
      afterEach(() => {
        nock.cleanAll();
      });

      it('should route to /players when login was success', () => {
        mockLogin();
        const account = {
          email,
          password: 'Password1',
          secret: 'test',
          platform: 'xone'
        };
        const store = mockStore({ account });

        return store.dispatch(actions.login(account))
          .then(() => { // return of async actions
            expect(store.getActions()).to.include({
              type: '@@router/CALL_HISTORY_METHOD',
              payload: { method: 'push', args: ['/players'] }
            });
          });
      });

      it('should dispatch SET_CREDITS when getCredits is completed', () => {
        // Mock credits response
        const credits = 1000;
        nock('https://utas.external.s3.fut.ea.com')
          .post(`/ut/game/fifa${version}/user/credits`)
          .reply(200, { credits });

        const store = mockStore({});

        return store.dispatch(actions.getCredits(email))
          .then(() => { // return of async actions
            expect(store.getActions()).to.include(actions.setCredits(credits));
          });
      });

      it('should dispatch SET_PILESIZE when getPilesize is completed', () => {
        // Mock pilesize response
        const response = { entries: [{ key: 2, value: 30 }, { key: 4, value: 30 }] };
        nock('https://utas.external.s3.fut.ea.com')
          .post(`/ut/game/fifa${version}/clientdata/pileSize`)
          .reply(200, response);

        const store = mockStore({});
        return store.dispatch(actions.getPilesize(email))
          .then(() => { // return of async actions
            const reduxActions = store.getActions();
            expect(reduxActions).to.include(
              actions.setPilesize('tradepile', response.entries[0].value)
            );
            expect(reduxActions).to.include(
              actions.setPilesize('watchlist', response.entries[1].value)
            );
          });
      });
    });
  });
});
