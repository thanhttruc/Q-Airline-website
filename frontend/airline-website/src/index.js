import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import Layout from './components/Layout/Layout';
import Dashboard from './components/Admin/Dashboard'
import Routers from './components/router/Routers'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <BrowserRouter >
      <Layout />
      </BrowserRouter>
    </AuthContextProvider>
  </React.StrictMode>
);

reportWebVitals();