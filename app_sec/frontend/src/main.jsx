import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { CLIENT_ID } from './constants';

import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider 
    clientId={CLIENT_ID}
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>,
);
