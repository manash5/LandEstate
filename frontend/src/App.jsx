import React from 'react';
import AppRoutes from './private/routes/AppRoutes';
import { ToastContainer, Bounce } from 'react-toastify';

function App() {

  return (
    <>
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      transition={Bounce}
      />
       <AppRoutes />
      </>
   
  )
}

export default App;

    