/* eslint-disable no-unused-expressions */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import sinon from 'sinon';
import * as actions from '../../app/actions/bid';
import * as types from '../../app/actions/bidTypes';
import * as logic from '../../app/actions/logic';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

let sandbox;
describe('actions', () => {
  describe('bid', () => {
    describe('creators', () => {
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
        const watchlist = [1, 2, 3];
        expect(actions.setWatchlist(watchlist)).to.eql(
          { type: types.SET_WATCHLIST, watchlist }
        );
      });
    });
    describe('async creators', () => {
      beforeEach(() => {
        sandbox = sinon.sandbox.create();
      });
      afterEach(() => {
        sandbox.restore();
      });

      it('should reset cycle count and call cycle() when start() is called', async () => {
        const logicStub = sandbox.stub(logic, 'default').returns(() => {});
        const store = mockStore({});
        await store.dispatch(actions.start());
        expect(logicStub.calledOnce).to.eql(true);
        expect(store.getActions()).to.be.eql([
          { type: types.START_BIDDING },
          { type: types.SET_CYCLES, count: 0 }
        ]);
      });
    });
  });
});
