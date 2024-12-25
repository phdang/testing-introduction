import React from 'react';
import Component from './Component';
import renderer from 'react-test-renderer';

test('matches snapshot', () => {
  const tree = renderer.create(
    <Component />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
