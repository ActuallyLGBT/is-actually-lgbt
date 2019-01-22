import React from 'react';

import MainLayout from '../components/layout/MainLayout';
import Wizard from '../components/Wizard/Wizard';

class Setup extends React.Component {
  render(): JSX.Element {
    return (
      <MainLayout>
        <Wizard>
          <Wizard.Page>
            {(nextStep, prevStep, submitForm) => (
              <div>
                <h1>Step 1!</h1>
                <button onClick={prevStep}>Previous</button>
                <button onClick={nextStep}>Next</button>
              </div>
            )}
          </Wizard.Page>
          <Wizard.Page>
            {(nextStep, prevStep, submitForm) => (
              <div>
                <h1>Step 2!</h1>
                <button onClick={prevStep}>Previous</button>
                <button onClick={nextStep}>Next</button>
              </div>
            )}
          </Wizard.Page>
          <Wizard.Page>
            {(nextStep, prevStep, submitForm) => (
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
