import React from 'react';

import OptionalCard from '../_optional-card';

import Checkbox from '../checkbox';
import Grid from '../grid';
import GridItem from '../grid-item';

import BEM from '../utilities/ts/bem';

import hasErrorOrSuccess from './utilities/has-error-or-success';
import hasMessage from './utilities/has-message';

interface Checkboxes {
  className?: string;
  id?: string;
  label: string;
  style?: React.CSSProperties;
  value: string;
}

interface Props {
  cards?: boolean;
  checkboxes: Checkboxes[];
  className?: string;
  disabled?: boolean;
  error?: string[];
  message?: string;
  name?: string;
  onChange?: (value: string, name: string) => void;
  readOnly?: boolean;
  style?: React.CSSProperties;
  success?: string[];
  value?: string[];
}

interface State {
  error: string[];
  success: string[];
  value: string[];
}

class CheckboxSet extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {
    cards: false,
    disabled: false,
    onChange: () => {
      return;
    },
    readOnly: false
  };

  checkboxesArray: string[] = this.props.checkboxes.map(checkbox => {
    return checkbox.value;
  });

  intersection: string[] = this.checkboxesArray.filter(
    value => this.props.value && this.props.value.indexOf(value) !== -1
  );

  readonly state: Readonly<State> = {
    error: this.props.error ? this.props.error : [],
    success: this.props.success ? this.props.success : [],
    value: this.intersection.length !== 0 ? this.intersection : []
  };

  componentDidUpdate(prevProps): void {
    if (prevProps.error !== this.props.error) {
      if (!this.props.error) {
        this.setState({ error: [] });
      } else {
        this.setState({ error: [...this.props.error] });
      }
    }

    if (prevProps.success !== this.props.success) {
      if (!this.props.success) {
        this.setState({ success: [] });
      } else {
        this.setState({ success: [...this.props.success] });
      }
    }
  }

  handleChange = (value: string): void => {
    const previousSelection: string[] = this.state.value;

    if (this.state.value.indexOf(value) === -1) {
      previousSelection.push(value);
    } else {
      const selectionIndex: number = this.state.value.indexOf(value);

      previousSelection.splice(selectionIndex, 1);
    }

    this.setState({
      error: [],
      success: [],
      value: previousSelection
    });

    this.props.onChange(value, this.props.name);
  };

  render() {
    const { props, state, handleChange } = this;

    const error: string = state.error.length ? `error` : ``;
    const success: string =
      !state.error.length && state.success.length ? `success` : ``;

    const bem = BEM(`checkbox-set`);
    bem.addModifiers(error);
    bem.addModifiers(success);
    bem.addClassNames(props.className);

    return (
      <div className={bem.getResult()} style={props.style}>
        <Grid modifiers="gutter-x-fixed">
          {props.checkboxes.map((checkbox, index) => (
            <GridItem key={index} modifiers="s-12 m-6 align-end">
              <OptionalCard
                disabled={props.disabled}
                readOnly={props.readOnly}
                visible={props.cards}>
                <Checkbox
                  id={checkbox.id}
                  modifiers={hasErrorOrSuccess(
                    state.error,
                    state.success,
                    checkbox.value
                  )}
                  className={checkbox.className}
                  style={checkbox.style}
                  name={props.name}
                  value={checkbox.value}
                  disabled={props.disabled}
                  readOnly={props.readOnly}
                  checked={state.value.indexOf(checkbox.value) !== -1}
                  onChange={handleChange}>
                  {checkbox.label}
                </Checkbox>
              </OptionalCard>
            </GridItem>
          ))}
        </Grid>
        <div className={bem.getElement(`border`)} />
        {hasMessage(state.error, state.success, props.message) && (
          <span className={bem.getElement(`message`)}>{props.message}</span>
        )}
      </div>
    );
  }
}

export { CheckboxSet as default };
