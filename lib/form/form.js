// * React imports
import PropTypes from 'prop-types';
import React from 'react';

// * React component
export default class OCForm extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.elementIndex = 0;
  }

  componentDidMount() {
    this.formRef.current.addEventListener('keydown', this.lookKeycode, false);
  }

  getNextElem = (collection, elementName) => {
    var elem = null;

    for (let index = 0; index < collection.length; index++) {
      var elements = collection[index].querySelectorAll('[name]');

      if (elements.length > 0) {
        for (let index = 0; index < elements.length; index++) {
          let name = elements[index].getAttribute('name');
          if (name === elementName) {
            elem = elements[index];
            break;
          }
        }
      }
    }

    return elem;
  };

  getElementFromIndex(collection, index) {
    return collection[index];
  }

  getCurrentElemIndex = (collection, targetElem, elementName) => {
    var index = -1;

    index = Array.prototype.indexOf.call(collection, targetElem);

    if (index === -1) {
      for (let i = 0; i < collection.length; i++) {
        var elements = collection[i].querySelectorAll('[name]');
        if (elements.length > 0) {
          for (let j = 0; j < elements.length; j++) {
            let name = elements[j].getAttribute('name');
            if (name === elementName) {
              index = i;
              break;
            }
          }
        }
      }
    }

    return index;
  };

  nextElement = (collection, currentIndex, elemName) => {
    var nextElem = null;
    if (currentIndex === -1) return null;
    let i = currentIndex + 1;
    var foundNextElem = false;
    var allowedElement = ['INPUT', 'BUTTON', 'TEXTAREA'];

    for (i; i < collection.length; i++) {
      if (foundNextElem) break;

      if (allowedElement.indexOf(collection[i].nodeName) !== -1) {
        //skip if next element is disabled
        if (
          collection[i].hasAttribute('disabled') ||
          collection[i].hasAttribute('readonly')
        ) {
          continue;
        }
        if (collection[i].nodeName === 'INPUT') {
          if (collection[i].getAttribute('name') === elemName) {
            continue;
          }
        }
        if (this.validElementForFocus(collection[i])) {
          nextElem = collection[i];
          foundNextElem = true;
        } else {
          nextElem = collection[i].nextSibling;
          foundNextElem = true;
        }
      }
    }

    return nextElem;
  };

  validElementForFocus = element => {
    if (element.getAttribute('type') === 'hidden') {
      return false;
    }

    return true;
  };

  lookKeycode = event => {
    if (event.key === 'Enter') {
      const node = this.formRef.current;
      // const formElements = node.elements;
      const formElements = node.querySelectorAll('[name]');
      const target = event.target || event.srcElement;
      const elementName = target.getAttribute('name');

      if (target.nodeName === 'TEXTAREA') {
        return false;
      }

      event.preventDefault();
      let currentElemindex = this.getCurrentElemIndex(
        formElements,
        target,
        elementName
      );

      let nextElem = this.nextElement(
        formElements,
        currentElemindex,
        elementName
      );

      if (nextElem !== null) {
        if (nextElem.getAttribute('type') === 'radio') {
          const radioName = nextElem.getAttribute('name');
          let checkedRadio = node.querySelectorAll(
            "input[name='" + radioName + "']:checked"
          );
          if (checkedRadio.length > 0) {
            nextElem = checkedRadio[0];
          }
        }
        nextElem.focus();
        if (nextElem.getAttribute('type') === 'submit') {
          this.props.onSubmit();
        }
      }

      if (typeof target !== 'undefined') {
        if (target.nodeName === 'BUTTON' && target.type === 'submit') {
          this.props.onSubmit();
        }
      }

      return false;
    }
  };

  render() {
    const { props, formRef } = this;
    return (
      <form ref={formRef} onSubmit={props.onSubmit}>
        {props.children}
      </form>
    );
  }
}

OCForm.propTypes = {
  onSubmit: PropTypes.func
};

OCForm.defaultProps = {
  onSubmit: () => {}
};
