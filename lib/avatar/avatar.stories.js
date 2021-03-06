import React from 'react';

import { storiesOf } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import {
  number,
  optionsKnob as options,
  text,
  withKnobs
} from '@storybook/addon-knobs';

import OCUniform from '../uniform';
import OCAvatar from './avatar';

import uniformStyles from '../../.storybook/storybook';

const avatarHref = ['Link', 'https://www.example.com'];
const avatarImage = ['Image URL', ''];
const avatarFirstName = ['First name', 'Angela'];
const avatarSex = [
  'Sex',
  {
    Female: 'female',
    Male: 'male',
    Undisclosed: 'undisclosed'
  },
  'female',
  { display: 'inline-radio' }
];
const avatarValue = ['Number', 1];

const stories = storiesOf('Avatar', module);

stories.addDecorator(withA11y).addDecorator(withKnobs);

stories
  .add('Default', () => {
    const image = text(...avatarImage);
    const firstName = text(...avatarFirstName);
    const sex = options(...avatarSex);
    const state = options(
      'State',
      {
        Default: '',
        Reversed: 'reversed'
      },
      '',
      { display: 'inline-radio' }
    );

    return (
      <OCUniform tag="div" style={{ ...uniformStyles, width: '8rem' }}>
        <OCAvatar
          image={image ? image : null}
          firstName={firstName ? firstName : 'Add first name'}
          sex={sex}
          modifiers={state ? `avatar--${state}` : null}
        />
      </OCUniform>
    );
  })
  .add('Small', () => {
    const href = text(...avatarHref);
    const image = text(...avatarImage);
    const firstName = text(...avatarFirstName);
    const sex = options(...avatarSex);
    const state = options(
      'State',
      {
        Default: '',
        Reversed: 'reversed'
      },
      '',
      { display: 'inline-radio' }
    );

    return (
      <OCUniform tag="div" style={uniformStyles}>
        {href ? (
          <OCAvatar
            href={href ? href : null}
            image={image ? image : null}
            firstName={firstName ? firstName : 'Add first name'}
            sex={sex}
            modifiers={`avatar--s${state ? ` avatar--${state}` : ''}`}
          />
        ) : (
          <OCAvatar
            firstName={firstName ? firstName : 'Add first name'}
            sex={sex}
            modifiers={`avatar--s${state ? ` avatar--${state}` : ''}`}
          />
        )}
      </OCUniform>
    );
  })
  .add('Medium', () => {
    const href = text(...avatarHref);
    const image = text(...avatarImage);
    const firstName = text(...avatarFirstName);
    const sex = options(...avatarSex);
    const state = options(
      'State',
      {
        Default: '',
        Error: 'error',
        Success: 'success',
        Reversed: 'reversed'
      },
      '',
      { display: 'inline-radio' }
    );
    const value =
      state === 'error' || state === 'success' ? number(...avatarValue) : 0;

    return (
      <OCUniform tag="div" style={uniformStyles}>
        {href ? (
          <OCAvatar
            href={href}
            image={image ? image : null}
            firstName={firstName ? firstName : 'Add first name'}
            sex={sex}
            modifiers={`avatar--m${state ? ` avatar--${state}` : ''}`}
            value={value ? value : 'Add label'}
          />
        ) : (
          <OCAvatar
            image={image ? image : null}
            firstName={firstName ? firstName : 'Add first name'}
            sex={sex}
            modifiers={`avatar--m${state ? ` avatar--${state}` : ''}`}
            value={value ? value : 'Add label'}
          />
        )}
      </OCUniform>
    );
  })
  .add('Large', () => {
    const href = text(...avatarHref);
    const image = text(...avatarImage);
    const firstName = text(...avatarFirstName);
    const sex = options(...avatarSex);
    const state = options(
      'State',
      {
        Default: '',
        Error: 'error',
        Success: 'success',
        Reversed: 'reversed'
      },
      '',
      { display: 'inline-radio' }
    );
    const value =
      state === 'error' || state === 'success' ? number(...avatarValue) : 0;

    return (
      <OCUniform tag="div" style={uniformStyles}>
        {href ? (
          <OCAvatar
            href={href}
            image={image ? image : null}
            firstName={firstName ? firstName : 'Add first name'}
            sex={sex}
            modifiers={`avatar--l${state ? ` avatar--${state}` : ''}`}
            value={value ? value : 'Add label'}
          />
        ) : (
          <OCAvatar
            image={image ? image : null}
            firstName={firstName ? firstName : 'Add first name'}
            sex={sex}
            modifiers={`avatar--l${state ? ` avatar--${state}` : ''}`}
            value={value ? value : 'Add label'}
          />
        )}
      </OCUniform>
    );
  });
