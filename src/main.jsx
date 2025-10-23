// src/main.jsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'

import { ThemeProvider } from './components/theme-provider.jsx'
import App from './App.jsx'
import { Root } from './routes/Root.jsx';
import { CountryDetail } from './routes/CountryDetail.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true, // This makes App the default child route
        element: <App />,
      },
      {
        path: "country/:countryCode",
        element: <CountryDetail />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
)