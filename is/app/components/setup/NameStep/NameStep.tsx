import React, { FormEvent } from 'react';
import { debounce } from 'throttle-debounce';

import NameStatus from './NameStatus';

const styles = require('./NameStep.css');

interface NameStepProps {
  nextStep: React.FormEventHandler<HTMLElement>;
  prevStep: React.FormEventHandler<HTMLElement>;
}

interface NextStepState {
  nameValue: string;
  query: string;
  hasError: boolean;
}

class NameStep extends React.Component<NameStepProps, NextStepState> {
  state = {
    nameValue: '',
    query: '',
    hasError: false
  };

  onNameChange = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    const validNameRegex = new RegExp(/^([^!-@[-`{-~][^!-+/-@[-`{-~]*)?$/, 'gi');

    this.setState({ nameValue: value }, () => {
      if (validNameRegex.test(value)) {
        this.setState({ hasError: false });
        this.debounceSetQuery(value);
      } else {
        this.setState({ hasError: true });
      }
    });
  };

  setQuery = query => this.setState({ query });

  debounceSetQuery = debounce(400, this.setQuery);

  onSubmit = (event: FormEvent<HTMLFormElement>) => {
    // For later
    this.props.nextStep(event);
  };

  render(): React.ReactNode {
    const { nameValue, query, hasError } = this.state;

    return (
      <div className={styles.nameStep}>
        <form onSubmit={this.onSubmit}>
          <fieldset>
            <label htmlFor="name">What's your name?</label>
            <input onChange={this.onNameChange} name="name" value={nameValue} />
          </fieldset>
        </form>
        {hasError ? <p>Pls no</p> : <NameStatus name={query} />}
      </div>
    );
  }
}

export default NameStep;
