import React from 'react';

export interface WizardState {
  [key: string]: any;
}

interface PageChild {
  (
    nextStep: React.FormEventHandler<HTMLElement>,
    prevStep: React.FormEventHandler<HTMLElement>,
    wizardState: WizardState
  ): JSX.Element;
}

interface PageProps {
  nextStep?: React.FormEventHandler<HTMLElement>;
  prevStep?: React.FormEventHandler<HTMLElement>;
  children?: PageChild;
  wizardState?: WizardState;
}

type PageType = React.ReactElement<PageProps>;

interface WizardProps {
  children?: PageType[];
  className?: string;
  freezeStep?: number;
}

interface WizardReactState {
  currentPage: number;
  wizardState: WizardState;
}

class Wizard extends React.Component<WizardProps, WizardReactState> {
  static Page = ({ children, nextStep, prevStep, wizardState }: PageProps) =>
    children(nextStep, prevStep, wizardState);

  state = {
    currentPage: 0,
    wizardState: {}
  };

  nextStep = (newState: object = {}): void => {
    const { children } = this.props;
    const { currentPage, wizardState } = this.state;

    if (currentPage < children.length - 1) {
      this.setState({ currentPage: currentPage + 1, wizardState: { ...wizardState, ...newState } });
    }
  };

  prevStep = (): void => {
    const { currentPage } = this.state;

    if (currentPage !== 0) {
      this.setState({ currentPage: currentPage - 1 });
    }
  };

  renderStep(step: PageType): React.ReactNode {
    return React.cloneElement(step, {
      nextStep: this.nextStep,
      prevStep: this.prevStep,
      wizardState: this.state.wizardState
    });
  }

  render(): React.ReactNode {
    const { children: steps, className, freezeStep } = this.props;
    const { currentPage } = this.state;
    const pageIndex = freezeStep || currentPage;

    if (steps.length < 2) {
      throw new Error('Two or more steps required');
    }

    return <div className={className}>{this.renderStep(steps[pageIndex])}</div>;
  }
}

export default Wizard;
