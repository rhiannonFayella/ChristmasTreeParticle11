import React, { useState } from 'react';
import Experience from './components/Experience';
import { TreeState } from './types';

const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<TreeState>(TreeState.TREE_SHAPE);

  // Convert Enum to number for shader interpolation (0 = SCATTERED, 1 = TREE)
  const modeValue = currentMode === TreeState.TREE_SHAPE ? 1.0 : 0.0;

  const toggleMode = () => {
    setCurrentMode((prev) => 
      prev === TreeState.TREE_SHAPE ? TreeState.SCATTERED : TreeState.TREE_SHAPE
    );
  };

  return (
    <div className="relative w-full h-screen bg-black">
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Experience treeState={modeValue} />
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-8 md:p-12">
        {/* Header */}
        <header className="flex flex-col items-center md:items-start text-center md:text-left animate-fade-in-down">
          <h1 className="font-serif text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 tracking-widest uppercase drop-shadow-lg">
            Arix Signature
          </h1>
          <h2 className="font-light text-emerald-400 tracking-[0.5em] text-sm md:text-base mt-2 uppercase">
            Interactive Holiday Experience
          </h2>
        </header>

        {/* Footer / Controls */}
        <footer className="flex flex-col items-center pb-8 pointer-events-auto">
          <button
            onClick={toggleMode}
            className="group relative px-8 py-4 bg-transparent overflow-hidden transition-all duration-300 hover:scale-105"
          >
            {/* Custom Golden Border Button */}
            <div className="absolute inset-0 border border-yellow-600/50 group-hover:border-yellow-400 transition-colors duration-500 transform skew-x-[-12deg]" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 to-black/20 transform skew-x-[-12deg] group-hover:bg-emerald-900/40 transition-colors" />
            
            <span className="relative font-serif text-yellow-100 group-hover:text-white tracking-widest text-lg transition-colors flex items-center gap-3">
              {currentMode === TreeState.TREE_SHAPE ? (
                <>
                  <span>DISASSEMBLE</span>
                  <svg className="w-4 h-4 text-yellow-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </>
              ) : (
                <>
                   <svg className="w-4 h-4 text-emerald-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>ASSEMBLE TREE</span>
                </>
              )}
            </span>
          </button>
          
          <div className="mt-4 text-emerald-700/50 text-xs tracking-widest font-mono">
            VIRTUAL INSTALLATION 2024
          </div>
        </footer>
      </div>
      
      {/* Decorative Corners */}
      <div className="absolute top-0 left-0 w-32 h-32 pointer-events-none opacity-50">
         <div className="absolute top-8 left-8 w-full h-[1px] bg-gradient-to-r from-yellow-500 to-transparent"></div>
         <div className="absolute top-8 left-8 h-full w-[1px] bg-gradient-to-b from-yellow-500 to-transparent"></div>
      </div>
      <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-50 rotate-180">
         <div className="absolute top-8 left-8 w-full h-[1px] bg-gradient-to-r from-yellow-500 to-transparent"></div>
         <div className="absolute top-8 left-8 h-full w-[1px] bg-gradient-to-b from-yellow-500 to-transparent"></div>
      </div>
    </div>
  );
};

export default App;
