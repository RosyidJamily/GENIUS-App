import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Dismiss opener once DOM is hydrated
if (typeof (window as any).dismissAppOpener === 'function') {
  setTimeout(() => {
    (window as any).dismissAppOpener();
  }, 700);
}
