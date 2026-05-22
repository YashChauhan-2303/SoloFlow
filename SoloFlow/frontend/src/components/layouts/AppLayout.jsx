import React from 'react';
import Navbar from '../Navbar';

const AppLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f]">
      {/* Noise texture overlay */}
      <div className="noise-overlay" />

      {/* Ambient glow orbs */}
      <div
        className="sf-glow-orb sf-glow-purple"
        style={{
          width: '600px',
          height: '600px',
          top: '-200px',
          left: '-100px',
        }}
      />
      <div
        className="sf-glow-orb sf-glow-blue"
        style={{
          width: '500px',
          height: '500px',
          bottom: '-150px',
          right: '-100px',
        }}
      />

      {/* Navbar */}
      <Navbar />

      {/* Main content area */}
      <main className="relative z-10 pt-0">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
