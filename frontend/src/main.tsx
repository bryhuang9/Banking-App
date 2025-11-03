// MAIN ENTRY POINT - Where React App Starts
// This file is the first thing that runs when the app loads

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; // Redux state management
import { BrowserRouter } from 'react-router-dom'; // Routing
import App from './App';
import { store } from './store/store'; // Redux store
import './styles/globals.css'; // Global styles

// Get the root element from index.html
const root = document.getElementById('root')!;

// Create React root and render the app
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    {/* Redux Provider - Makes store available to entire app */}
    <Provider store={store}>
      {/* Router - Enables navigation between pages */}
      <BrowserRouter>
        {/* Main App Component */}
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// HOW THIS WORKS:
//
// 1. Browser loads index.html
// 2. index.html has <div id="root"></div>
// 3. This file finds that div
// 4. Creates a React root
// 5. Renders App inside Provider and Router
//
// COMPONENT TREE:
// React.StrictMode
//   └─ Provider (Redux)
//       └─ BrowserRouter (React Router)
//           └─ App (Your application)
//
// WHY THIS ORDER?
// - StrictMode: Development checks (outer wrapper)
// - Provider: State management (wrap everything that needs state)
// - BrowserRouter: Routing (wrap everything that needs navigation)
// - App: Your actual application code
