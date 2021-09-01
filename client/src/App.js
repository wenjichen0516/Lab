import React from 'react';
import './App.css';
import routes from './routes'
import { renderRoutes } from 'react-router-config'
import { BrowserRouter } from 'react-router-dom'
import { GlobalStyle } from './style'

function App() {
  return (
    <div className="App">
      <GlobalStyle />
      <BrowserRouter>
        {renderRoutes(routes)}
      </BrowserRouter>
    </div>
  );
}

export default App;
