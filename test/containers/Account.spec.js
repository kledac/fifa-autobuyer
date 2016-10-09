import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Account } from '../../app/containers/Account';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

function setup(initialState) {
  const actions = {
    setAccountInfo: spy(),
    login: spy()
  };
  const store = mockStore(initialState);
  const context = { context: { store, router: { push: spy() } } };
  const component = mount(<Account {...initialState} {...actions} />, context);
  return {
    component,
    actions,
    inputs: component.find('input'),
    selects: component.find('select'),
    buttons: component.find('button')
  };
}


describe('containers', () => {
  describe('Account', () => {
    it('should call setAccountInfo when data changes', () => {
      const { actions, inputs, selects } = setup({
        account: {
          email: 'test@test.com',
          password: 'test',
          secret: 'test',
          platform: 'xone'
        }
      });
      expect(inputs).to.have.length(3);
      expect(selects).to.have.length(1);
      inputs.forEach(f => f.simulate('change'));
      selects.forEach(f => f.simulate('change'));
      expect(actions.setAccountInfo.callCount).to.be.equal(4);
    });

    it('should call login when button is pressed with valid credentials', () => {
      const { component, actions, buttons } = setup({
        account: {
          email: 'test@test.com',
          password: 'Password1',
          secret: 'test',
          platform: 'xone'
        }
      });
      expect(buttons).to.have.length(1);
      buttons.simulate('click');
      expect(component.state('errors')).to.be.empty;
      expect(actions.login.called).to.be.true;
    });

    it('should return errors with invalid credentials', () => {
      const { component, buttons } = setup({
        account: {
          email: '', // invalid email
          password: '', // invalid password
          secret: '', // no secret
          platform: ''
        }
      });
      expect(buttons).to.have.length(1);
      buttons.simulate('click');
      const errors = component.state('errors');
      expect(errors).to.include.keys('email');
      expect(errors).to.include.keys('password');
    });
  });
});
