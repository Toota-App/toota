import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
//import * as Buffer from 'buffer'; // Import the polyfill


//global.Buffer = Buffer; // Register it globally for libraries like jsonwebtoken

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
