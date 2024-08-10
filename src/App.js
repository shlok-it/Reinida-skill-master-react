import React, { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './assets/scss/page-loader.scss';
import './assets/scss/themes.scss';
import 'simplebar-react/dist/simplebar.min.css';
import Route from './Routes';
import {ToastContainer } from 'react-toastify';

function App() {
  useEffect(()=>{
    
  },[])
  return (
    <React.Fragment>
      <ToastContainer autoClose={3000} position="top-center" pauseOnHover />
      <Route />
    </React.Fragment>
  );
}

export default App;
