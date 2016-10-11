import { expect } from 'chai';
import { account } from '../../app/reducers/account';
import * as types from '../../app/actions/accountTypes';


describe('reducers', () => {
  describe('account', () => {
    it('should handle initial state', () => {
      expect(account(undefined, {})).to.eql({});
    });

    it('should handle SET_ACCOUNT_INFO', () => {
      const key = 'email';
      const value = 'new@test.com';
      expect(
        account({ email: 'old@test.com' }, { type: types.SET_ACCOUNT_INFO, key, value })
      ).to.eql(
        { email: 'new@test.com' }
      );
    });

    it('should handle SET_CREDITS', () => {
      expect(
        account({ credits: 100 }, { type: types.SET_CREDITS, credits: 1000 })
      ).to.eql(
        { credits: 1000 }
      );
    });

    it('should handle unknown action type', () => {
      expect(
        account({ account: {} }, { type: 'unknown' })
      ).to.eql({ account: {} });
    });
  });
});
