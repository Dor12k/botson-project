import React from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-br from-blue-600 to-blue-400 text-white rounded-xl shadow-lg px-4 py-20">
      <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
        Welcome to Botson.ai
      </h1>

      <p className="text-lg md:text-xl mb-10 max-w-xl font-light">
        Your AI-powered platform for job indexing and skill analysis.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/dashboard"
          className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow hover:bg-blue-100 transition"
        >
          Go to Dashboard
        </Link>

        <Link
          to="/chat"
          className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow hover:bg-blue-100 transition"
        >
          Try Chat Assistant
        </Link>
      </div>
    </section>
  );
};

export default Index;
