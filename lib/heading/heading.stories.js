import React from 'react';

import { storiesOf } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import {
  optionsKnob as options,
  select,
  text,
  withKnobs
} from '@storybook/addon-knobs';

import OCUniform from '../uniform';
import OCHeading from './heading';

import uniformStyles from '../../.storybook/storybook';

const headingChildren = ['Heading', 'Certificate IV in Web Technologies'];
const headingLevel = [
  'Level',
  { '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6' },
  '1'
];
const headingAlignment = [
  'Alignment',
  { Left: 'left', Center: 'center', Right: 'right', Justify: 'justify' },
  'left',
  { display: 'inline-radio' }
];
const headingState = [
  'State',
  { Default: '', Reversed: 'reversed' },
  '',
  { display: 'inline-radio' }
];

const stories = storiesOf('Heading', module);

stories.addDecorator(withA11y).addDecorator(withKnobs);

stories
  .add('Default', () => {
    const children = text(...headingChildren);
    const level = select(...headingLevel);
    const alignment = options(...headingAlignment);
    const state = options(...headingState);

    return (
      <OCUniform style={{ ...uniformStyles, width: '50%' }}>
        <OCHeading
          level={Number(level)}
          modifiers={`h${level}--${alignment}${
            state ? ` h${level}--${state}` : ''
          }`}>
          {children ? children : 'Add heading'}
        </OCHeading>
      </OCUniform>
    );
  })
  .add('Compact', () => {
    const children = text(...headingChildren);
    const level = select(...headingLevel);
    const alignment = options(...headingAlignment);
    const state = options(...headingState);

    return (
      <OCUniform style={{ ...uniformStyles, width: '50%' }}>
        <OCHeading
          level={Number(level)}
          modifiers={`h${level}--compact h${level}--${alignment}${
            state ? ` h${level}--${state}` : ''
          }`}>
          {children ? children : 'Add heading'}
        </OCHeading>
      </OCUniform>
    );
  });
