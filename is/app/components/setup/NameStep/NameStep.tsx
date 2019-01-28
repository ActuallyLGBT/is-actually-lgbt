import React, { FormEvent } from 'react';
import { debounce } from 'throttle-debounce';

import NameStatus from './NameStatus';

const styles = require('./NameStep.css');

interface NameStepProps {
  nextStep: React.FormEventHandler<HTMLElement>;
  prevStep: React.FormEventHandler<HTMLElement>;
}

interface NextStepState {
  nameValue: String;
  query: String;
}

class NameStep extends React.Component<NameStepProps, NextStepState> {
  state = {
    nameValue: '',
    query: '',
    hasError: false
  };

  onNameChange = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    this.setState({ nameValue: value }, () => {
      console.log('callback: ', value);
      this.debounceSetQuery(value);
    });
  };

  setQuery = query => {
    console.log('query: ', query);
    this.setState({ query });
  };

  debounceSetQuery = debounce(400, this.setQuery);

  onSubmit = (event: FormEvent<HTMLFormElement>) => {
    // For later
    this.props.nextStep(event);
  };

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    console.log(error);
    return { hasError: true };
  }

  render(): React.ReactNode {
    const { nameValue, query } = this.state;
    if (this.state.hasError) {
      console.log('error');
      return <h2>Oh shit</h2>;
    }
    console.log('bonko');
    return (
      <div className={styles.nameStep}>
        <form onSubmit={this.onSubmit}>
          <fieldset>
            <label htmlFor="name">What's your name?</label>
            <input onChange={this.onNameChange} name="name" value={nameValue} />
          </fieldset>
        </form>
        <NameStatus name={query} />
      </div>
    );
  }
}

export default NameStep;
