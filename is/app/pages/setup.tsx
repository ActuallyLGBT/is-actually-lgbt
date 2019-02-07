import React from 'react';

import MainLayout from '../components/layout/MainLayout';
import Wizard from '../components/Wizard/Wizard';
import NameStep from '../components/setup/NameStep';

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
            {(nextStep, prevStep) => (
              <div>
                <h1>Step 2!</h1>
                <button onClick={prevStep}>Previous</button>
                <button onClick={nextStep}>Next</button>
              </div>
            )}
          </Wizard.Page>
          <Wizard.Page>
            {(nextStep, prevStep) => (
              <div>
                <h1>Step 3!</h1>
                <button onClick={prevStep}>Previous</button>
                <button onClick={nextStep}>Next</button>
              </div>
            )}
          </Wizard.Page>
        </Wizard>
      </MainLayout>
    );
  }
}

export default Setup;
