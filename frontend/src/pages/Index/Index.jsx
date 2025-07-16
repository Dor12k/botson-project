
import React from 'react';

import '../../index.css'
import Header from '../../components/Index/Header';
// import Main from '../../components/Index/Main';
import { Link } from "react-router-dom";


const Index = () => {

    return (

        <section className="min-h-screen bg-blue-500 text-white flex flex-col items-center justify-center">
            
            <h1 className="text-5xl font-bold mb-6">Welcome to Botson.ai</h1>
            <p className="text-lg mb-8">AI-powered job skill analyzer</p>

            <div className="flex gap-4">
                <Link
                to="/dashboard"
                className="bg-white text-blue-600 px-6 py-2 rounded shadow hover:bg-gray-100 transition"
                >
                Go to Dashboard
                </Link>
                <Link
                to="/chat"
                className="bg-white text-blue-600 px-6 py-2 rounded shadow hover:bg-gray-100 transition"
                >
                Try Chat Assistant
                </Link>
            </div>
        </section>

    );
};

export default Index;