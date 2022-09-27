import React from 'react';

import { ThemeProvider } from 'styled-components';

import GlobalStyle from './styles/global';
import dark from './styles/themes/main';
import { WidthProvider } from 'contexts/width';

import Router from './routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//add window methods to global scope
declare global {
  interface Window {
    kleverWeb: any;
  }
}

const App: React.FC = () => (
  <ThemeProvider theme={dark}>
    <WidthProvider>
      <ToastContainer autoClose={2000} position="top-right" />
      <GlobalStyle />
      <Router />
    </WidthProvider>
  </ThemeProvider>
);

export default App;
