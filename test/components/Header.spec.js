import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Header } from '../../app/components/Header';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

function setup(initialState) {
  const store = mockStore(initialState);
  const context = { context: { store, router: { push: spy() } } };
  const component = shallow(<Header {...initialState} />, context);
  return {
    component,
    bordered: component.find('.bordered'),
    credits: component.find('.text')
  };
}


describe('components', () => {
  describe('Header', () => {
    it('should have no border if on login', () => {
      const { bordered } = setup({ hideLogin: true });
      expect(bordered).to.have.length(0);
    });

    it('should have a border if logged in', () => {
      const { bordered } = setup({ hideLogin: false, credits: 1000 });
      expect(bordered).to.have.length(1);
    });

    it('should display credits if logged in', () => {
      const { credits } = setup({ hideLogin: false, credits: 1000 });
      expect(credits).to.have.length(1);
    });
  });
});
