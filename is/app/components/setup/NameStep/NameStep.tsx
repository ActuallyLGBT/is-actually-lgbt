import React from 'react';

interface NameStepProps {
  nextStep: React.FormEventHandler<HTMLElement>;
  prevStep: React.FormEventHandler<HTMLElement>;
}

class NameStep extends React.Component<NameStepProps, {}> {
  render(): React.ReactNode {
    return '';
  }
}

export default NameStep;
