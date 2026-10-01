import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { SiteContentProvider } from './context/SiteContentContext.jsx';
import './index.css';

// Ensure dark class is removed when theme option is disabled
if (typeof document !== 'undefined') {
  document.documentElement.classList.remove('dark');
  document.documentElement.removeAttribute('data-theme');
  try {
    localStorage.removeItem('nmc_theme');
  } catch (_) {}
}

// React 18 + Google Translate DOM Reconciliation Safety Patch
if (typeof Node === 'function' && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function (child) {
    if (child.parentNode !== this) {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('React DOM: child not in parent (prevented crash from translator wrapper):', child);
      }
      return child;
    }
    return originalRemoveChild.apply(this, arguments);
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('React DOM: referenceNode not in parent (prevented crash from translator wrapper):', referenceNode);
      }
      return newNode;
    }
    return originalInsertBefore.apply(this, arguments);
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <SiteContentProvider>
            <App />
          </SiteContentProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
