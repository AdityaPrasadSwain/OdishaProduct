import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import './i18n'; // Initialize i18n
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { initEmailjs } from './utils/emailService';
import './index.css';

import { WishlistProvider } from './context/WishlistContext';
import { FollowProvider } from './context/FollowContext';
import { Provider } from 'react-redux';
import { store } from './store/store';

initEmailjs();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
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
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
