
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-12 px-4 text-center">
      <div className="inline-block relative">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-gradient mb-2">
          ARUN AI <span className="text-blue-500">STUDIO</span>
        </h1>
        <div className="h-1 w-24 bg-blue-600 mx-auto rounded-full cinematic-glow"></div>
      </div>
      <p className="mt-6 text-gray-400 text-lg font-light max-w-2xl mx-auto uppercase tracking-[0.2em]">
        Next-Generation Realistic Vision Engine
      </p>
    </header>
  );
};

export default Header;
