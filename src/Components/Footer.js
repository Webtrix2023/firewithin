import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      {/* full-width; links start from the very left with page padding */}
      <div className="w-full px-4 md:px-10 py-2 md:py-3">
        <nav className="flex flex-wrap justify-start gap-x-4 gap-y-1
                        text-[11px] md:text-xs text-gray-300">
          <a href="#" className="hover:text-white hover:underline">Privacy Policy</a>
          <a href="#" className="hover:text-white hover:underline">Terms of Service</a>
          <a href="#" className="hover:text-white hover:underline">Accessibility Statement</a>
          <a href="#" className="hover:text-white hover:underline">Cookie Policy</a>
        </nav>

        <p className="text-[11px] md:text-xs text-gray-400 mt-1">
          © 2025 Indel Services, LLC. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
