import React from 'react';

function Footer() {
  return (
    <footer className="w-full py-8 mt-12 text-center text-sm text-slate-500 border-t border-white/[0.05] bg-[#0a0a0f]/40 backdrop-blur-xl">
      © {new Date().getFullYear()} SoloFlow. All rights reserved.
    </footer>
  );
}

export default Footer;