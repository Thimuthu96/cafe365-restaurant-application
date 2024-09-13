import React from 'react';
import './App.scss';
import '../node_modules/react-toastify/dist/ReactToastify.css'


//components
import AppRouter from './routes/AppRoutes'

function App() {
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;
