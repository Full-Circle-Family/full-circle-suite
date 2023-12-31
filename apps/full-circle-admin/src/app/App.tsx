// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './App.module.css';

import { Route, Routes, Link, BrowserRouter as Router } from 'react-router-dom';
import SidebarNavigation from './components/SidebarNavigation';
import Analytics from './components/Analytics';
import PageNotFound from './components/PageNotFound';
import ControlPanel from './components/ControlPanel';
import Settings from './components/Settings';
// import loader from '../assets/Ball-Loader.gif';

// import { Amplify } from 'aws-amplify';
import { Authenticator, ThemeProvider } from '@aws-amplify/ui-react';
import { AuthStyle } from './AuthUI';
import '@aws-amplify/ui-react/styles.css';
// import awsmobile from '../amplify-backend/src/aws-exports';
//import * as config from '../amplify-backend/src/amplifyconfiguration.json';

// Amplify.configure(awsmobile);

function RenderItem() {
  return (
    <ThemeProvider theme={AuthStyle()}>
      <Authenticator
        hideSignUp={true}
        className="w-screen h-full bg-primary-light"
      >
        {({ signOut }) => (
          <div className="flex w-screen  h-full">
            <Router>
              <div className="basis-1/6 h-full">
                <SidebarNavigation signOut={signOut} />
              </div>
              <div className="basis-5/6 h-full overflow-scroll">
                <Routes>
                  <Route path="/" element={<Analytics />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/controls" element={<ControlPanel />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<PageNotFound />} />
                </Routes>
              </div>
            </Router>
          </div>
        )}
      </Authenticator>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <div className="flex flex-row h-screen">
      <RenderItem />
    </div>
  );
}

if (import.meta.vitest) {
  // add tests related to your file here
  // For more information please visit the Vitest docs site here: https://vitest.dev/guide/in-source.html

  const { it, expect, beforeEach } = import.meta.vitest;
  let render: typeof import('@testing-library/react').render;

  beforeEach(async () => {
    render = (await import('@testing-library/react')).render;
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <Router>
        <App />
      </Router>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should have a greeting as the title', () => {
    const { getByText } = render(
      <Router>
        <App />
        {/* START: routes */}
        {/* These routes and navigation have been generated for you */}
        {/* Feel free to move and update them to fit your needs */}
        <br />
        <hr />
        <br />
        <div role="navigation">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/page-2">Page 2</Link>
            </li>
          </ul>
        </div>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                This is the generated root route.{' '}
                <Link to="/page-2">Click here for page 2.</Link>
              </div>
            }
          />
          <Route
            path="/page-2"
            element={
              <div>
                <Link to="/">Click here to go back to root page.</Link>
              </div>
            }
          />
        </Routes>
        {/* END: routes */}
      </Router>
    );
    expect(getByText(/Welcome full-circle-admin/gi)).toBeTruthy();
  });
}
