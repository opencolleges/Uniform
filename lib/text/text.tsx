import _ from 'lodash';
import React from 'react';

import { NAMESPACE } from '../utilities/ts/constants';

import BEM from '../utilities/ts/bem';
import remove from '../utilities/ts/remove';

// * child imports
import Icon from '../icon';

interface Props {
  autoComplete?:
    | `additional-name`
    | `address-level1`
    | `address-level2`
    | `address-level3`
    | `address-level4`
    | `address-line1`
    | `address-line2`
    | `address-line3`
    | `bday`
    | `bday-day`
    | `bday-month`
    | `bday-year`
    | `cc-additional-name`
    | `cc-csc`
    | `cc-exp`
    | `cc-exp-month`
    | `cc-exp-year`
    | `cc-family-name`
    | `cc-given-name`
    | `cc-name`
    | `cc-number`
    | `cc-type`
    | `country`
    | `country-name`
    | `current-password`
    | `email`
    | `family-name`
    | `given-name`
    | `honorific-namespace`
    | `honorific-suffix`
    | `impp`
    | `language`
    | `name`
    | `new-password`
    | `nickname`
    | `off`
    | `on`
    | `organization`
    | `organization-title`
    | `photo`
    | `postal-code`
    | `sex`
    | `street-address`
    | `tel`
    | `tel-area-code`
    | `tel-country-code`
    | `tel-extension`
    | `tel-local`
    | `tel-national`
    | `transaction-amount`
    | `transaction-currency`
    | `url`
    | `username`;
  autoFocus?: boolean;
  className?: string;
  disabled?: boolean;
  id?: string;
  label: string;
  maxLength?: number;
  message?: string;
  modifiers?: string;
  name?: string;
  onBlur?: () => void;
  onChange?: (event: React.ChangeEvent, value: string, name: string) => void;
  onFocus?: (event: React.FocusEvent) => void;
  onMouseDown?: () => void;
  onPaste?: () => void;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  spellCheck?: boolean;
  style?: React.CSSProperties;
  type?: `email` | `number` | `password` | `tel` | `text` | `url`;
  value?: string;
}

interface State {
  error: boolean;
  keyStrokes: boolean;
  success: boolean;
  value: string;
}

// * React component
export default class Text extends React.Component<Props> {
  static defaultProps: Partial<Props> = {
    disabled: false,
    onBlur: () => {
      return;
    },
    onChange: () => {
      return;
    },
    onFocus: () => {
      return;
    },
    onMouseDown: () => {
      return;
    },
    onPaste: () => {
      return;
    },
    readOnly: false,
    required: false,
    spellCheck: false,
    type: `text`
  };

  static getDerivedStateFromProps(nextProps: Props, nextState: State): object {
    if (nextProps.value !== nextState.value) {
      return {
        value: nextProps.value
      };
    }
    return null;
  }

  id = this.props.id ? this.props.id : _.uniqueId(`${NAMESPACE}-`);

  readonly state: Readonly<State> = {
    error: _.includes(_.split(this.props.modifiers, ` `), `error`),
    keyStrokes: this.props.type === `password` ? false : null,
    success: _.includes(_.split(this.props.modifiers, ` `), `success`),
    value: ``
  };

  shouldComponentUpdate(nextProps: Props): boolean {
    if (this.state.value === nextProps.value) {
      return false;
    }
    return true;
  }

  componentDidMount(): void {
    this.setState({
      value: this.calculateValue()
    });
  }

  componentDidUpdate(previousProps: Props, previousState: State): void {
    if (this.props.modifiers !== previousProps.modifiers) {
      this.setState({
        error: _.includes(_.split(this.props.modifiers, ` `), `error`),
        success: _.includes(_.split(this.props.modifiers, ` `), `success`)
      });
    }

    if (this.props.disabled !== previousProps.disabled) {
      this.setState({
        disabled: this.props.disabled
      });
    }

    if (this.state.value !== previousState.value) {
      this.setState({
        error: false,
        success: false
      });

      // ! Not ideal.
      this.forceUpdate();
    }

    if (this.props.value !== previousProps.value) {
      this.setState({
        value: this.props.value
      });
    }
  }

  handleFocus = (event: React.FocusEvent): void => {
    const { onFocus } = this.props;
    const target: HTMLInputElement = event.target as HTMLInputElement;

    // * select the input's value
    target.select();

    // * If the input type is password, then set the keyStrokes state to:
    // * false.
    if (this.props.type === `password`) {
      this.setState({ keyStrokes: false });
    }

    onFocus(event);
  };

  handleKeyDown = (event: React.KeyboardEvent): void => {
    // * event.keycode conflates keys on mobile keypad.
    const key: string = event.key;

    // * If the input type is password, there have been no previous key strokes
    // * since focus and the backspace or delete keys are pressed, then set the
    // * value state to: ''.
    if (
      this.props.type === `password` &&
      !this.state.keyStrokes &&
      (key === `Backspace` || key === `Delete`)
    ) {
      this.setState({ value: `` });
    }

    // * If the input type is number, then prevent any other keys from
    // * leaking into the input's value.
    if (this.props.type === `number`) {
      const validKeys = [
        `Backspace`,
        `Tab`,
        `ArrowLeft`,
        `ArrowUp`,
        `ArrowRight`,
        `ArrowDown`,
        `Delete`,
        `0`,
        `1`,
        `2`,
        `3`,
        `4`,
        `5`,
        `6`,
        `7`,
        `8`,
        `9`,
        // * Mathematical operators
        `-`,
        `+`,
        // * Allows selct all functionality.
        `a`,
        // * Allows copy, paste and cut functionality.
        `c`,
        `v`,
        `x`
      ];

      if (validKeys.indexOf(key) === -1) {
        event.preventDefault();
      }
    }
  };

  handleChange = (event: React.ChangeEvent) => {
    const target: HTMLInputElement = event.target as HTMLInputElement;

    this.setState({ value: target.value });

    // * If the input type is password, then set the keyStrokes state to: true.
    if (this.props.type === `password`) {
      this.setState({ keyStrokes: true });
    }

    this.props.onChange(event, target.value, this.props.name);
  };

  calculateValue = (): string => {
    if (!this.props.value) {
      return ``;
    }

    if (
      this.props.maxLength &&
      this.props.maxLength > 0 &&
      this.props.value.length >= this.props.maxLength
    ) {
      return this.props.value.substring(0, this.props.maxLength);
    }

    return this.props.value;
  };

  render() {
    const { props, state, id, handleFocus, handleKeyDown, handleChange } = this;

    const modifiers = remove([`error`, `success`], props.modifiers);

    const bem = BEM(`text`);
    bem.addModifiers(modifiers);
    bem.addModifiers(state.error ? `error` : ``);
    bem.addModifiers(state.success ? `success` : ``);
    bem.addClassNames(props.className);

    return (
      <div className={bem.getResult()} style={props.style}>
        <input
          id={id}
          className={
            !state.value
              ? bem.getElement(`input`)
              : `${bem.getElement(`input`)} active`
          }
          type={props.type}
          name={props.name}
          disabled={props.disabled}
          readOnly={props.readOnly}
          required={props.required}
          autoComplete={props.autoComplete}
          autoFocus={props.autoFocus}
          maxLength={
            props.maxLength && props.maxLength > 0 ? props.maxLength : null
          }
          placeholder={props.type !== `password` ? props.placeholder : null}
          spellCheck={props.spellCheck}
          value={state.value}
          tabIndex={!props.readOnly && !props.disabled ? 0 : -1}
          {...props}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          onBlur={props.onBlur}
          onPaste={props.onPaste}
        />
        <label className={bem.getElement(`label`)}>{props.label}</label>
        {!props.readOnly && !props.disabled && (
          <Icon type="close" visible={state.error ? state.error : false} />
        )}
        {!props.readOnly && !props.disabled && (
          <Icon type="tick" visible={state.success ? state.success : false} />
        )}
        {!props.readOnly && !props.disabled && (
          <div className={bem.getElement(`border`)} />
        )}
        {!props.readOnly && !props.disabled && props.message && (
          <span className={bem.getElement(`message`)}>{props.message}</span>
        )}
      </div>
    );
  }
}
