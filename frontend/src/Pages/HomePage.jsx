import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-700 text-white p-6">
      <div className="bg-white text-gray-800 p-8 rounded-2xl shadow-lg max-w-2xl w-full text-center">
        <h1 className="text-5xl font-extrabold mb-4">Invoice Generator</h1>
        <p className="text-lg text-gray-600 mb-6">
          Easily create and download professional invoices in just a few clicks.
        </p>
        <button className="bg-purple-600 text-white px-8 py-3 rounded-full shadow-lg text-lg font-semibold hover:bg-purple-700 transition transform hover:scale-105"
        onClick={() => navigate("/create-invoice")}>
          Create Invoice
        </button>
      </div>
    </div>
  );
};

export default Home;
