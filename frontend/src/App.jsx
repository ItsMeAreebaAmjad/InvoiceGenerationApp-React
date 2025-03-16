import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Pages/HomePage';
import InvoiceForm from './Pages/InvoiceForm';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-invoice" element={<InvoiceForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
