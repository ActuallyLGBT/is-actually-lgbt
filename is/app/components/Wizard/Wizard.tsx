import React from 'react';
import cn from 'classnames';

interface PageChild {
  (
    nextStep: React.FormEventHandler<HTMLElement>,
    prevStep: React.FormEventHandler<HTMLElement>
  ): JSX.Element;
}

interface PageProps {
  nextStep?: React.FormEventHandler<HTMLElement>;
  prevStep?: React.FormEventHandler<HTMLElement>;
  children?: PageChild;
}

type PageType = React.ReactElement<PageProps>;

interface WizardProps {
  children?: PageType[];
  className?: string;
}

interface WizardState {
  currentPage: number;
}

class Wizard extends React.Component<WizardProps, WizardState> {
  static Page = ({ children, nextStep, prevStep }: PageProps) => children(nextStep, prevStep);

  state = {
    currentPage: 0
  };

  nextStep = (): void => {
    const { children } = this.props;
    const { currentPage } = this.state;

    if (currentPage < children.length - 1) {
      this.setState({ currentPage: currentPage + 1 });
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
      prevStep: this.prevStep
    });
  }

  render(): React.ReactNode {
    const { children: steps, className } = this.props;
    const { currentPage } = this.state;

    if (steps.length < 2) {
      throw new Error('Two or more steps required');
    }

    return <div className={className}>{this.renderStep(steps[currentPage])}</div>;
  }
}

export default Wizard;
