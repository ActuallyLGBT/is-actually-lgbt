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

  render(): React.ReactNode {
    const { email, password } = this.state;

    const {
      wizardState: { slug }
    } = this.props;

    return (
      <div className={styles.registerStep}>
        <h2>{`Claim ${slug}.is.actually.lgbt`}</h2>
        <form>
          <fieldset>
            <label htmlFor="email">Email</label>
            <input onChange={this.onChange} name="email" value={email} />
            <label htmlFor="password">Password</label>
            <input onChange={this.onChange} name="password" value={password} type="password" />
          </fieldset>
        </form>
      </div>
    );
  }
}

export default RegisterStep;
