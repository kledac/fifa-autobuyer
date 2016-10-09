/* eslint-disable no-unused-expressions */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';
import { mockLogin } from '../mocks/login';
import * as actions from '../../app/actions/account';

const version = 17;
const email = 'test@test.com';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('async actions', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('routes to /players when login was success', () => {
    mockLogin();
    const account = { email, password: 'test', secret: 'test', platform: 'xone' };
    const store = mockStore({ account });

    return store.dispatch(actions.login(account))
      .then(() => { // return of async actions
        expect(store.getActions()).to.include({
          type: '@@router/CALL_HISTORY_METHOD',
          payload: { method: 'push', args: ['/players'] }
        });
      });
  });

  it('dispatches SET_CREDITS when getCoins is completed', () => {
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
});

describe('actions', () => {
  it('setAccountInfo should create SET_ACCOUNT_INFO action', () => {
    const key = 'email';
    const value = 'test@test.com';
    expect(actions.setAccountInfo(key, value)).to.deep.equal(
      { type: actions.SET_ACCOUNT_INFO, key, value }
    );
  });

  it('setCredits should create SET_CREDITS action', () => {
    const credits = 1000;
    expect(actions.setCredits(credits)).to.deep.equal(
      { type: actions.SET_CREDITS, credits }
    );
  });
});
