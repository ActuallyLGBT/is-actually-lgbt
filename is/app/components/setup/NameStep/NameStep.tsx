import React, { FormEvent } from 'react';
import { debounce } from 'throttle-debounce';

import NameStatus from './NameStatus';

const styles = require('./NameStep.css');

interface NameStepProps {
  nextStep: (newState: object) => void;
  prevStep: React.FormEventHandler<HTMLElement>;
}

interface NameStepState {
  nameValue: string;
  query: string;
  hasError: boolean;
}

class NameStep extends React.Component<NameStepProps, NameStepState> {
  state = {
    nameValue: '',
    query: '',
    hasError: false
  };

  onNameChange = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    const validNameRegex = new RegExp(/^([a-z0-9][^\x00-\x1f!-+/:-@[-`{-\x7f]*)?$/, 'gi');

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

  onClaim = (slug: string) => {
    this.props.nextStep({ slug });
  };

  render(): React.ReactNode {
    const { nameValue, query, hasError } = this.state;

    return (
      <div className={styles.nameStep}>
        <form>
          <fieldset>
            <label htmlFor="name">What's your name?</label>
            <input onChange={this.onNameChange} name="name" value={nameValue} />
          </fieldset>
        </form>
        <NameStatus name={query} hasError={hasError} onClaim={this.onClaim} />
      </div>
    );
  }
}

export default NameStep;
