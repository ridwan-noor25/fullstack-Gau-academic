// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import App from "./App.jsx";
// import "./index.css"; // tailwind entry

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import "./index.css"; // tailwind entry
import AuthProvider from './auth/AuthContext';


createRoot(document.getElementById('root')).render(
<BrowserRouter>
<AuthProvider>
<App />
</AuthProvider>

</BrowserRouter>
)