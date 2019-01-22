import React from 'react';

interface PageChild {
  (nextStep: Function, prevStep: Function, submitForm: Function): JSX.Element;
}

interface PageProps {
  nextStep?: Function;
  prevStep?: Function;
  submitForm?: Function;
  children?: PageChild;
}

type PageType = React.ReactElement<PageProps>;

interface WizardProps {
  children?: PageType[];
}

interface WizardState {
  currentPage: number;
}

class Wizard extends React.Component<WizardProps, WizardState> {
  static Page = ({ children, nextStep, prevStep, submitForm }: PageProps) =>
    children(nextStep, prevStep, submitForm);

  state = {
    currentPage: 0
  };

  nextStep = () => {
    const { children } = this.props;
    const { currentPage } = this.state;

    if (currentPage < children.length - 1) {
      this.setState({ currentPage: currentPage + 1 });
    }
  };

  prevStep = () => {
    const { currentPage } = this.state;

    if (currentPage !== 0) {
      this.setState({ currentPage: currentPage - 1 });
    }
  };

  submitForm = () => {};

  renderStep(step: PageType) {
    return React.cloneElement(step, {
      nextStep: this.nextStep,
      prevStep: this.prevStep,
      submitForm: this.submitForm
    });
  }

  render(): React.ReactNode {
    const { children: steps } = this.props;
    const { currentPage } = this.state;

    if (steps.length < 2) {
      throw new Error('Two or more steps required');
    }

    return <div>{this.renderStep(steps[currentPage])}</div>;
  }
}

export default Wizard;
