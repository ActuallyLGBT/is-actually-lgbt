import React from 'react';

import MainLayout from '../components/layout/MainLayout';
import Wizard from '../components/Wizard/Wizard';
import NameStep from '../components/setup/NameStep';
import RegisterStep from '../components/setup/RegisterStep';
import ProfileEdit from '../components/setup/ProfileEdit';

const styles = require('./styles/setup.css');

class Setup extends React.Component {
  isNameAvailable(name: string) {
    return !!name;
  }

  render(): React.ReactNode {
    return (
      <MainLayout>
        <Wizard className={styles.setup}>
          <Wizard.Page>
            {(nextStep, prevStep) => <NameStep nextStep={nextStep} prevStep={prevStep} />}
          </Wizard.Page>
          <Wizard.Page>
            {(nextStep, prevStep, wizardState) => (
              <RegisterStep nextStep={nextStep} prevStep={prevStep} wizardState={wizardState} />
            )}
          </Wizard.Page>
          <Wizard.Page>{(nextStep, prevStep) => <ProfileEdit />}</Wizard.Page>
        </Wizard>
      </MainLayout>
    );
  }
}

export default Setup;
