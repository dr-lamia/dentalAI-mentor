import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize environment variables
if (!import.meta.env.VITE_API_URL) {
  console.warn('API URL not set, using default: http://localhost:8000');
}

if (!import.meta.env.VITE_WS_URL) {
  console.warn('WebSocket URL not set, using default: ws://localhost:8000');
}

if (!import.meta.env.VITE_GOOGLE_AI_API_KEY) {
  console.warn('Google AI API key not set, using default key');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);