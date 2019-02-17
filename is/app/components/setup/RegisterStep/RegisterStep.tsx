import React, { FormEvent } from 'react';
import { WizardState } from 'components/Wizard';

const styles = require('./RegisterStep.css');

interface RegisterStepProps {
  nextStep: (newState: object) => void;
  prevStep: React.FormEventHandler<HTMLElement>;
  wizardState: WizardState;
}

interface RegisterStepState {
  email: string;
  password: string;
}

class RegisterStep extends React.Component<RegisterStepProps, RegisterStepState> {
  state = {
    email: '',
    password: ''
  };

  onChange = (event: FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { name, value }
    } = event;

    if (name === 'email') {
      this.setState({ email: value });
    }

    if (name === 'password') {
      this.setState({ password: value });
    }
  };

  onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    this.props.nextStep({});
  };

  render(): React.ReactNode {
    const { email, password } = this.state;

    const {
      wizardState: { slug = 'foobar' }
    } = this.props;

    return (
      <div className={styles.registerStep}>
        <h2>Claim this domain?</h2>
        <span className={styles.domain}>{`${slug}.is.actually.lgbt`}</span>
        <form onSubmit={this.onSubmit}>
          <fieldset>
            <div className={styles.formField}>
              <label htmlFor="email">Email</label>
              <input onChange={this.onChange} name="email" value={email} />
            </div>
            <div className={styles.formField}>
              <label htmlFor="password">Password</label>
              <input onChange={this.onChange} name="password" value={password} type="password" />
            </div>
          </fieldset>

          <button type="submit">Sign up</button>
        </form>
      </div>
    );
  }
}

export default RegisterStep;
