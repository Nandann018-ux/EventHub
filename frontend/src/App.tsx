import React from 'react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-extrabold text-indigo-600 drop-shadow-md">Welcome to EventHub</h1>
        <p className="text-xl text-gray-700 max-w-lg mx-auto">
          Your React frontend is successfully configured with Vite, Tailwind CSS, Framer Motion, and TypeScript!
        </p>
      </div>
    </div>
  );
};

export default App;
