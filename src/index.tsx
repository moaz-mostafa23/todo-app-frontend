import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import awsconfig from './aws-exports';
import { Amplify } from 'aws-amplify';

Amplify.configure(awsconfig);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);