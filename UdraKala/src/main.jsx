import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeProvider';
import { initEmailjs } from './utils/emailService';
import './index.css';

import { WishlistProvider } from './context/WishlistContext';
import { FollowProvider } from './context/FollowContext';

initEmailjs();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <DataProvider>
            <WishlistProvider>
              <FollowProvider>
                <App />
              </FollowProvider>
            </WishlistProvider>
          </DataProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
