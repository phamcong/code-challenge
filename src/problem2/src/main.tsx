// This file should be main.tsx, not main.jsx, to support TypeScript syntax.
// Please rename this file to main.tsx for proper TSX support.

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
