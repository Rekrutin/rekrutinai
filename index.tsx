
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
// import { inject } from '@vercel/analytics';
// import { injectSpeedInsights } from '@vercel/speed-insights';

// Initialize Vercel features - Commented out for browser ESM stability
// inject();
// injectSpeedInsights();

console.log(`RekrutIn App Loaded - Build: ${new Date().toISOString()}`);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
