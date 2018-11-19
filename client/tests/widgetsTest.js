// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, NavBar } from '../src/widgets.js';
import { shallow, mount } from 'enzyme';
import {CardView} from "../src/widgets";

describe('Alert tests', () => {
  const wrapper = shallow(<Alert />);

  it('initially', () => {
    let instance: ?Alert = Alert.instance();
    expect(typeof instance).toEqual('object');
    if (instance) expect(instance.alerts).toEqual([]);

    expect(wrapper.find('button.close')).toHaveLength(0);
  });

  it('after danger', done => {
    Alert.danger('test');

    setTimeout(() => {
      let instance: ?Alert = Alert.instance();
      expect(typeof instance).toEqual('object');
      if (instance) expect(instance.alerts).toEqual([{ text: 'test', type: 'danger' }]);

      expect(wrapper.find('button.close')).toHaveLength(1);

      done();
    });
  });

  it('after clicking close button', () => {
    wrapper.find('button.close').simulate('click');

    let instance: ?Alert = Alert.instance();
    expect(typeof instance).toEqual('object');
    if (instance) expect(instance.alerts).toEqual([]);

    expect(wrapper.find('button.close')).toHaveLength(0);
  });
});

describe('NavBarBrand test', () => {
    const wrapper = shallow(
        <NavBar.Brand>
            Test
        </NavBar.Brand>
    );

    it('Sjekker at Brand har de rette klassene', () => {
        expect(wrapper.find('NavLink').hasClass('navbar-brand')).toEqual(true)
    });
});

describe('NavBarLink test', () => {
  const wrapper = shallow(
      <NavBar.Link to='#'>
        Test
      </NavBar.Link>
  );

  it('Sjekker at Link har de rette klassene', () => {
      expect(wrapper.find('NavLink').hasClass('nav-link')).toEqual(true)
  });
});

describe('CardView test', () => {
    const wrapper = shallow(
        <CardView title='Overskrift' picture='bildeLink' ingress='test test'/>
    );

    it('Sjekker at Card har den rette klassen', () => {
        expect(wrapper.find('Card').hasClass('h-100')).toEqual(true)
    });
});