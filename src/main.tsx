import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import { store } from './redux/store'
import { loadSettings } from './hooks/useSettings'
import './index.css'

// Apply persisted theme before first render to avoid flash
const _s = loadSettings()
document.documentElement.setAttribute('data-theme', _s.darkMode ? 'dark' : 'light')
document.documentElement.setAttribute('data-reduce-motion', String(_s.reduceMotion))

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
