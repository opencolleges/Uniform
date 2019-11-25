import React from 'react';
import Icon, { IconTypes } from '../icon';
import BEM, { BEMInterface } from '../utilities/ts/bem';
import { TRANSITION_DURATION_x4 } from '../utilities/ts/constants';
import includes from '../utilities/ts/includes';
import itemise from '../utilities/ts/itemise';
import getElemMiddle from './utilities/get-elem-middle';
import getTimer from './utilities/get-timer';

type ModifiersTypes = `error` | `success`;

interface Props {
  className?: string;
  duration?: number;
  heading: string;
  icon?: IconTypes;
  id: string;
  message: string;
  modifiers?: ModifiersTypes;
  onClick?: (id: string) => void;
  style?: React.CSSProperties;
}

interface State {
  focus: boolean;
  mounted: boolean;
  mouseOver: boolean;
  top: number;
}

interface RenderInterface {
  handleBlur: () => void;
  handleClick: () => void;
  handleFocus: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  props: Props;
  state: State;
  toastRef: React.RefObject<HTMLDivElement>;
}

class Toast extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {
    duration: 8000,
    onClick: () => {
      return;
    }
  };

  timer: any = null;
  toastRef = React.createRef<HTMLDivElement>();

  readonly state: Readonly<State> = {
    focus: false,
    mounted: false,
    mouseOver: false,
    top: null
  };

  componentDidMount(): void {
    this.setState({ mounted: true, top: getElemMiddle(this.toastRef.current) });

    if (this.props.modifiers !== `error`) {
      this.timer = new getTimer(this.props.duration, this.handleClick);
    }
  }

  componentDidUpdate(): void {
    if (
      this.state.mounted &&
      this.state.top !== getElemMiddle(this.toastRef.current)
    ) {
      this.setState({ top: getElemMiddle(this.toastRef.current) });
    }

    if (this.state.mounted === false) {
      setTimeout(() => {
        this.props.onClick(this.props.id);
      }, TRANSITION_DURATION_x4);
    }
  }

  componentWillUnmount(): void {
    if (this.timer) {
      clearTimeout(this.timer.getTimerId());
    }
  }

  handleClick = (): void => {
    const toastRef: HTMLDivElement = this.toastRef.current;

    const nextToastRef: Node = toastRef.nextSibling;
    const previousToastRef: Node = toastRef.previousSibling;

    if (nextToastRef) {
      for (const childNode of Array.from(
        nextToastRef.childNodes
      ) as HTMLDivElement[]) {
        if (childNode.hasAttribute(`tabindex`)) {
          childNode.focus();
        }
      }
    } else if (previousToastRef) {
      for (const childNode of Array.from(
        previousToastRef.childNodes
      ) as HTMLDivElement[]) {
        if (childNode.hasAttribute(`tabindex`)) {
          childNode.focus();
        }
      }
    }

    this.setState({ focus: false, mounted: false });
  };

  handleMouseEnter = (): void => {
    if (this.props.modifiers !== `error` && !this.state.focus) {
      this.timer.pause();
    }

    this.setState({ mouseOver: true });
  };

  handleMouseLeave = (): void => {
    if (this.props.modifiers !== `error` && !this.state.focus) {
      this.timer.resume();
    }

    this.setState({ mouseOver: false });
  };

  handleFocus = (): void => {
    if (this.props.modifiers !== `error` && !this.state.mouseOver) {
      this.timer.pause();
    }

    this.setState({ focus: true });
  };

  handleBlur = (): void => {
    if (this.props.modifiers !== `error` && !this.state.mouseOver) {
      this.timer.resume();
    }

    this.setState({ focus: false });
  };

  // This method is triggered onKeyDown, because the default scroll behaviour
  // fires before onKeyUp.

  handleKeyDown = (e: React.KeyboardEvent): void => {
    const toastRef: HTMLDivElement = this.toastRef.current;

    // 'ArrowLeft' key
    if (e.keyCode === 37) {
      e.preventDefault();
      e.stopPropagation();

      if (toastRef.previousSibling) {
        for (const childNode of Array.from(
          toastRef.previousSibling.childNodes
        ) as HTMLDivElement[]) {
          if (childNode.hasAttribute(`tabindex`)) {
            childNode.focus();
            break;
          }
        }
      }
    }

    // 'ArrowUp' key
    if (e.keyCode === 38) {
      e.preventDefault();
      e.stopPropagation();

      if (toastRef.previousSibling) {
        for (const childNode of Array.from(
          toastRef.previousSibling.childNodes
        ) as HTMLDivElement[]) {
          if (childNode.hasAttribute(`tabindex`)) {
            childNode.focus();
            break;
          }
        }
      }
    }

    // 'ArrowRight' key
    if (e.keyCode === 39) {
      e.preventDefault();
      e.stopPropagation();

      if (toastRef.nextSibling) {
        for (const childNode of Array.from(
          toastRef.nextSibling.childNodes
        ) as HTMLDivElement[]) {
          if (childNode.hasAttribute(`tabindex`)) {
            childNode.focus();
            break;
          }
        }
      }
    }

    // 'ArrowDown' key
    if (e.keyCode === 40) {
      e.preventDefault();
      e.stopPropagation();

      if (toastRef.nextSibling) {
        for (const childNode of Array.from(
          toastRef.nextSibling.childNodes
        ) as HTMLDivElement[]) {
          if (childNode.hasAttribute(`tabindex`)) {
            childNode.focus();
            break;
          }
        }
      }
    }
  };

  render() {
    const {
      props,
      state,
      toastRef,
      handleKeyDown,
      handleFocus,
      handleBlur,
      handleMouseEnter,
      handleMouseLeave,
      handleClick
    }: RenderInterface = this;

    const BEM_MODULE: BEMInterface = BEM(`toast`);
    const {
      addClassNames,
      addModifiers,
      getElement,
      getResult
    }: BEMInterface = BEM_MODULE;

    addModifiers(props.modifiers);
    addClassNames(!!state.mounted ? `mounted` : ``);
    addClassNames(props.className);

    return (
      <div
        ref={toastRef}
        className={getResult()}
        style={{ top: `${state.top}rem`, ...props.style }}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
        <h6 className={getElement(`heading`)}>{props.heading}</h6>
        <p className={getElement(`message`)}>{props.message}</p>
        <button
          id={props.id}
          className={getElement(`button`)}
          tabIndex={0}
          title="Close"
          onClick={handleClick}>
          <Icon type="close" visible={true} />
        </button>
        <Icon
          type="close-ring"
          visible={includes(itemise(props.modifiers), `error`)}
        />
        <Icon
          type="tick-ring"
          visible={includes(itemise(props.modifiers), `success`)}
        />
        {!!props.icon &&
          (!includes(itemise(props.modifiers), `error`) &&
            !includes(itemise(props.modifiers), `success`)) && (
            <Icon type={props.icon} visible={true} />
          )}
      </div>
    );
  }
}

export { Toast as default };
