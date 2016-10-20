import React from 'react';
import { expect } from 'chai';
import { assert, stub, spy } from 'sinon';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Header } from '../../app/components/Header';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

stub(Header.prototype, 'handleClose');
stub(Header.prototype, 'handleMinimize');
stub(Header.prototype, 'handleFullscreen');
stub(Header.prototype, 'handleUserClick');

function setup(initialState) {
  const store = mockStore(initialState);
  const context = { context: { store, router: { push: spy() } } };
  const component = shallow(<Header {...initialState} />, context);
  return {
    component,
    bordered: component.find('.bordered'),
    credits: component.find('.text'),
    close: component.find('.button-close'),
    minimize: component.find('.button-minimize'),
    fullscreen: component.find('.button-fullscreen'),
    user: component.find('.login')
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

    it('should call handleClose on close', () => {
      const { component, close } = setup({ hideLogin: true });
      expect(close).to.have.length(1);
      close.simulate('click');
      assert.called(component.instance().handleClose);
    });

    it('should call handleMinimize on minimize', () => {
      const { component, minimize } = setup({ hideLogin: true });
      expect(minimize).to.have.length(1);
      minimize.simulate('click');
      assert.called(component.instance().handleMinimize);
    });

    it('should call handleFullscreen on fullscreen', () => {
      const { component, fullscreen } = setup({ hideLogin: true });
      expect(fullscreen).to.have.length(1);
      fullscreen.simulate('click');
      assert.called(component.instance().handleFullscreen);
    });

    it('should call handleUserClick on user', () => {
      const { component, user } = setup({ hideLogin: false, credits: 1000 });
      expect(user).to.have.length(1);
      user.simulate('click');
      assert.called(component.instance().handleUserClick);
    });
  });
});
