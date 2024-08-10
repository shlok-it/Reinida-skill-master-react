import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ContextProvider } from "./contexts/ContextProvider";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import rootReducer from "./slices";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({ reducer: rootReducer, devTools: true });
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.Fragment>
    <Provider store={store}>
      <ContextProvider>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <App />
        </BrowserRouter>
      </ContextProvider>
    </Provider>
  </React.Fragment>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
