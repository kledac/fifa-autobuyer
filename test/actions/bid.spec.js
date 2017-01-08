/* eslint-disable no-unused-expressions */
// import configureMockStore from 'redux-mock-store';
// import thunk from 'redux-thunk';
// import nock from 'nock';
import { expect } from 'chai';
// import { mockLogin } from '../mocks/login';
import * as actions from '../../app/actions/bid';
import * as types from '../../app/actions/bidTypes';

// const version = 17;
// const email = 'test@test.com';

// const middlewares = [thunk];
// const mockStore = configureMockStore(middlewares);

describe('actions', () => {
  describe('bid', () => {
    describe('creators', () => {
      it('should create ADD_MESSAGE action when addMessage() is called', () => {
        const msg = 'A message to be set';
        expect(actions.addMessage(msg)).to.eql(
          { type: types.ADD_MESSAGE, timestamp: new Date(), msg }
        );
      });

      it('should create SET_CYCLES action when setCycleCount() is called', () => {
        const count = 1;
        expect(actions.setCycleCount(count)).to.eql(
          { type: types.SET_CYCLES, count }
        );
      });

      it('should create SET_WATCH action when setWatched() is called', () => {
        const watched = { 111: 1 };
        expect(actions.setWatched(watched)).to.eql(
          { type: types.SET_WATCH, watched }
        );
      });

      it('should create UPDATE_WATCH action when updateWatched() is called', () => {
        const id = 112;
        const count = 1;
        expect(actions.updateWatched(id, count)).to.eql(
          { type: types.UPDATE_WATCH, id, count }
        );
      });

      it('should create SET_LISTED action when setListed() is called', () => {
        const listed = { 111: 1 };
        expect(actions.setListed(listed)).to.eql(
          { type: types.SET_LISTED, listed }
        );
      });

      it('should create UPDATE_LISTED action when updateListed() is called', () => {
        const id = 112;
        const count = 1;
        expect(actions.updateListed(id, count)).to.eql(
          { type: types.UPDATE_LISTED, id, count }
        );
      });

      it('should create SET_TRADES action when setTrades() is called', () => {
        const trades = { 111: { id: 111 } };
        expect(actions.setTrades(trades)).to.eql(
          { type: types.SET_TRADES, trades }
        );
      });

      it('should create UPDATE_TRADES action when updateTrades() is called', () => {
        const id = 112;
        const tradeResult = { id: 112 };
        expect(actions.updateTrades(id, tradeResult)).to.eql(
          { type: types.UPDATE_TRADES, id, tradeResult }
        );
      });

      it('should create SET_WATCHLIST action when setWatchlist() is called', () => {
        const watchlist = [ 1, 2, 3];
        expect(actions.setWatchlist(watchlist)).to.eql(
          { type: types.SET_WATCHLIST, watchlist }
        );
      });
    });
  });
});
