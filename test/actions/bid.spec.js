/* eslint-disable no-unused-expressions */
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import sinon from 'sinon';
import * as actions from '../../app/actions/bid';
import * as accountActions from '../../app/actions/account';
import * as types from '../../app/actions/bidTypes';
import * as logic from '../../app/actions/logic';
import * as ApiUtil from '../../app/utils/ApiUtil';
import player from '../mocks/player';

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

      it('should create SET_BIN_STATUS action when setBINStatus() is called', () => {
        const won = true;
        expect(actions.setBINStatus(won)).to.eql(
          { type: types.SET_BIN_STATUS, won }
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

      it('should handle empty search auctions for BIN price when snipe() is called', async () => {
        const searchStub = sandbox.stub().returns({ auctionInfo: [] });
        const apiStub = sandbox.stub(ApiUtil, 'getApi').returns({
          search: searchStub
        });
        const initialState = {
          account: {
            email: 'test@test.com',
            credits: 5000
          },
          bid: {
            bidding: true,
            listed: {}
          }
        };
        const settings = { minCredits: 1000, maxCard: 5 };
        const store = mockStore(initialState);
        await store.dispatch(actions.snipe(player, settings));
        expect(apiStub.calledOnce).to.eql(true);
        expect(searchStub.calledOnce).to.eql(true);
        expect(store.getActions().length).to.eql(0);
      });

      it('should not buy card when snipe() is called if not enough credits', async () => {
        const searchStub = sandbox.stub().returns({ auctionInfo: [{
          tradeId: 12345,
          buyNowPrice: 1,
          itemData: {
            contract: 1
          }
        }] });
        const bidStub = sandbox.stub().returns({ auctionInfo: [] });
        const apiStub = sandbox.stub(ApiUtil, 'getApi').returns({
          search: searchStub,
          placeBid: bidStub
        });
        const initialState = {
          account: {
            email: 'test@test.com',
            credits: 5000
          },
          bid: {
            bidding: true,
            listed: {}
          }
        };
        const settings = { minCredits: 10000, maxCard: 5 };
        const store = mockStore(initialState);
        await store.dispatch(actions.snipe(player, settings));
        expect(apiStub.calledOnce).to.eql(true);
        expect(searchStub.calledOnce).to.eql(true);
        expect(bidStub.called).to.eql(false);
        expect(store.getActions().length).to.eql(0);
      });

      it('should not buy card when snipe() is called if not enough contracts', async () => {
        const searchStub = sandbox.stub().returns({ auctionInfo: [{
          tradeId: 12345,
          buyNowPrice: 1,
          itemData: {
            contract: 0
          }
        }] });
        const bidStub = sandbox.stub().returns({ auctionInfo: [] });
        const apiStub = sandbox.stub(ApiUtil, 'getApi').returns({
          search: searchStub,
          placeBid: bidStub
        });
        const initialState = {
          account: {
            email: 'test@test.com',
            credits: 5000
          },
          bid: {
            bidding: true,
            listed: {}
          }
        };
        const settings = { minCredits: 1000, maxCard: 5 };
        const store = mockStore(initialState);
        await store.dispatch(actions.snipe(player, settings));
        expect(apiStub.calledOnce).to.eql(true);
        expect(searchStub.calledOnce).to.eql(true);
        expect(bidStub.called).to.eql(false);
        expect(store.getActions().length).to.eql(0);
      });

      it('should buy card when snipe() is called if conditions met', async () => {
        const searchStub = sandbox.stub().returns({ auctionInfo: [{
          tradeId: 12345,
          buyNowPrice: 1,
          itemData: {
            contract: 1
          }
        }] });
        const bidStub = sandbox.stub().returns({
          credits: 4999,
          auctionInfo: [{
            tradeId: 12345,
            tradeState: 'closed',
            bidState: 'buyNow',
            buyNowPrice: 1,
            itemData: {
              contract: 1
            }
          }]
        });
        const apiStub = sandbox.stub(ApiUtil, 'getApi').returns({
          search: searchStub,
          placeBid: bidStub
        });
        const initialState = {
          account: {
            email: 'test@test.com',
            credits: 5000
          },
          bid: {
            bidding: true,
            listed: {}
          }
        };
        const settings = { minCredits: 1000, maxCard: 5 };
        const store = mockStore(initialState);
        await store.dispatch(actions.snipe(player, settings));
        expect(apiStub.calledOnce).to.eql(true);
        expect(searchStub.calledOnce).to.eql(true);
        expect(bidStub.calledOnce).to.eql(true);
        /*
        --- console.log(store.getActions) ---
        [ { type: 'account/set/credits', credits: 4999 },
          { type: 'bid/set/binStatus', won: true },
          { type: 'bid/update/listed', id: '20801', count: 1 } ]
         */
        expect(store.getActions()).to.eql([
          accountActions.setCredits(4999),
          actions.setBINStatus(true),
          actions.updateListed(player.id, 1)
        ]);
      });
    });
  });
});
